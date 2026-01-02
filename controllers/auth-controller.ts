import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth-service.js";
import { TokenAccount } from "../types/account.js";
import config from "../config.js";
import passport from "passport";
import TokenRecoveryService from "../services/token-recovery-service.js";

// Load environment variables
dotenv.config({ quiet: true });

export class AuthController {
  // Dependency injection
  constructor(private authService: AuthService) {}

  // JWT variables
  private secret = config.jwtSecret as string;

  // Redirect URIS
  private webRedirectUri = config.webRedirectUrl as string;

  private allowedOrigins = config.allowedOrigins?.split(",") || [];

  private tokenRecoveryService = TokenRecoveryService;

  // JWT token
  private generateToken(user: TokenAccount) {
    const token = jwt.sign(
      { id: user._id, status: user.status },
      this.secret as string,
      {
        expiresIn: "7d", // Token expires in 7 days
      }
    );
    return token;
  }

  login = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the email and password from the request body
      const { email, password } = req.body;

      // Login the user
      const user = await this.authService.loginUser(email, password);

      // Check if the user was logged in
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = this.generateToken(user);

      // Return the user
      return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: { ...user, password: undefined },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Error logging in" });
    }
  };

  oauthRedirect = async (req: Request, res: Response, next: NextFunction) => {
    const redirectUri = req.query.redirect_uri as string;
    const platform = req.query.platform as string;

    // Encode redirect_uri in state parameter
    const state = Buffer.from(
      JSON.stringify({
        redirect_uri: redirectUri || config.webRedirectUrl,
        platform: platform || "web",
      })
    ).toString("base64");

    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
      state: state,
    })(req, res, next);
  };

  oauthCallback = async (req: Request, res: Response) => {
    try {
      const user = req.user as (TokenAccount & { state?: string }) | undefined;

      if (!user) {
        return res.status(401).json({ error: "OAuth authentication failed" });
      }

      const token = this.generateToken(user);

      // Get redirect_uri from state parameter
      let redirectUrl: string;

      try {
        if (user.state) {
          const decodedState: { platform: string; redirect_uri: string } =
            JSON.parse(Buffer.from(user.state, "base64").toString());

          // Check platform and redirect accordingly
          redirectUrl = `${decodedState.redirect_uri}?token=${token}&id=${user._id}`;
        } else {
          // Fallback to web redirect
          redirectUrl = `${this.webRedirectUri}/callback?token=${token}&id=${user._id}`;
        }
      } catch (error) {
        console.error("State decode error:", error);
        redirectUrl = `${this.webRedirectUri}/callback?token=${token}&id=${user._id}`;
      }

      console.log("Redirecting to:", redirectUrl);
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error("OAuth callback error:", error);
      return res.status(500).json({ error: "OAuth login failed" });
    }
  };

  /**
   * Create a new user
   * @param req
   * @param res
   * @returns new user
   */
  register = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Create new user
      const user = await this.authService.registerUser(req.body);

      // Check if the user was created
      if (!user) {
        return res.status(500).json({ error: "Error creating user" });
      }

      if (user === "Email already exists") {
        return res.status(400).json({ message: "Email already exists" });
      }

      return res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Error creating user" });
    }
  };

  /**
   * Logout a user
   * @param req
   * @param res
   * @returns user logged out
   */
  logout = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id from the request body
      const { id } = req.body;

      // Check if the id is valid
      if (!id && typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      const token = req.headers.authorization?.split(" ")[1] as string;
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }
      await this.authService.logoutUser(id);

      return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      return res.status(500).json({ error: "Error logging out" });
    }
  };

  /**
   * Refresh token if the user is logged in and token expires
   * @param req
   * @param res
   */
  refreshToken = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id from the request body
      const { id } = req.body;

      // Check if the id is valid
      if (!id && typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      let token = req.headers.authorization?.split(" ")[1] as string;
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      await this.authService.refreshToken(id);

      // Generate a JWT token
      token = this.generateToken({ _id: id, status: "active" });

      return res
        .status(200)
        .json({ message: "Token refreshed successfully", token });
    } catch (error) {
      console.error("Error refreshing token:", error);
      return res.status(500).json({ error: "Error refreshing token" });
    }
  };

  /**
   * Initiate password reset
   */
  initiatePasswordReset = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the email from the request body
      const { email, clientUrl } = req.body;

      // Check if the email is valid
      if (!email && typeof email !== "string") {
        return res.status(400).json({ error: "Invalid email" });
      }

      // Check if the user exists
      const user = await this.authService.getUserEmail(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Initiate password reset
      const response = await this.authService.initiatePasswordReset(
        email,
        clientUrl
      );

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error initiating password reset:", error);
      return res.status(500).json({ error: "Error initiating password reset" });
    }
  };

  redirectRecovery = async (req: Request, res: Response) => {
    try {
      const { token, continue: next } = req.query as {
        token?: string;
        continue?: string;
      };

      if (!token || !next) {
        return res
          .status(400)
          .send(
            this.getErrorPage(
              "Invalid Recovery Link",
              "The recovery link you're trying to use is invalid or incomplete.",
              "Please request a new password reset link."
            )
          );
      }

      const existingToken = await this.tokenRecoveryService.getToken(token);

      if (!existingToken?.token || existingToken.token !== token) {
        return res
          .status(400)
          .send(
            this.getErrorPage(
              "Link Expired",
              "This recovery link has expired or has already been used.",
              "Please request a new password reset link to continue."
            )
          );
      }

      // Check if the URL is valid
      let url: URL;
      try {
        url = new URL(next);
      } catch (error) {
        return res
          .status(400)
          .send(
            this.getErrorPage(
              "Invalid Recovery Link",
              "The recovery link format is incorrect.",
              "Please check your email and try clicking the link again."
            )
          );
      }

      // Check if the URL is a mobile deep link (exp://, myapp://, etc.)
      const isMobileDeepLink =
        !url.protocol.startsWith("https:") && !url.protocol.startsWith("http:");

      if (isMobileDeepLink) {
        // For mobile deep links, check if the protocol is in allowed origins
        const allowedProtocol = this.allowedOrigins.some((origin) =>
          next.startsWith(origin)
        );

        if (!allowedProtocol) {
          return res
            .status(400)
            .send(
              this.getErrorPage(
                "Unauthorized Link",
                "This recovery link is not authorized for use.",
                "Please contact support if you believe this is an error."
              )
            );
        }

        // Detect if user is on mobile device
        const userAgent = req.headers["user-agent"] || "";
        const isMobileDevice =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
          );

        if (!isMobileDevice) {
          // User opened mobile link on desktop - redirect to web version
          const webRedirectUri = config.webRedirectUrl + "/reset-password";
          const webUrl = new URL(webRedirectUri);
          webUrl.searchParams.set("token", token);

          return res.redirect(webUrl.toString());
        }

        // Mobile device - add token and redirect to app
        url.searchParams.set("token", token);
        return res.redirect(url.toString());
      }

      // For HTTP/HTTPS URLs, validate the origin
      const isAllowedOrigin = this.allowedOrigins.some((origin) => {
        if (origin.includes("://")) {
          return next.startsWith(origin);
        }
        return false;
      });

      if (!isAllowedOrigin) {
        console.log("Origin not allowed:", url.origin);
        return res
          .status(400)
          .send(
            this.getErrorPage(
              "Unauthorized Origin",
              "The destination URL is not authorized.",
              "Please contact support if you believe this is an error."
            )
          );
      }

      url.searchParams.set("token", token);
      return res.redirect(url.toString());
    } catch (error) {
      console.error("Error redirecting recovery:", error);
      // Fallback to web with token if available
      const fallbackUrl = config.webRedirectUrl + "/reset-password";
      const token = req.query.token as string;
      if (token) {
        const webUrl = new URL(fallbackUrl);
        webUrl.searchParams.set("token", token);
        return res.redirect(webUrl.toString());
      }
      return res.redirect(config.webRedirectUrl as string);
    }
  };

  /**
   * Change password
   * @param req
   * @param res
   */
  changePassword = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id from the request body
      const { id, password }: { id: string; password: string } = req.body;

      // Check if the user being changed is logged in
      if (req.user?.id !== id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if the id is valid
      if (!id && typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
      }

      // Check if the password is valid
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      await this.authService.changePassword(id, password);

      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Error changing password" });
    }
  };

  /**
   * Reset password
   * @param req
   * @param res
   */
  resetPassword = async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid JSON
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Get the id from the request body
      const { token, password }: { token: string; password: string } = req.body;

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      if (!password) {
        return res.status(401).json({ error: "No password provided" });
      }

      // Check if token is valid
      const tokenFromRedis = await this.tokenRecoveryService.getToken(token);
      const email = tokenFromRedis?.email;

      if (!tokenFromRedis || !email) {
        return res.status(401).json({ error: "Invalid token" });
      }

      await this.authService.resetPassword(email, token, password);

      return res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ error: "Error resetting password" });
    }
  };

  getResetEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.params as { token: string };
      console.log("token", token);
      const emailToken = await this.tokenRecoveryService.getToken(token);

      if (!emailToken) {
        return res.status(400).json({ error: "Invalid token" });
      }

      return res.status(200).json({ email: emailToken.email });
    } catch (error) {
      console.error("Error sending reset email:", error);
      return res.status(500).json({ error: "Error sending reset email" });
    }
  };

  private getErrorPage(
    title: string,
    message: string,
    suggestion: string
  ): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #0A0A0A;
          color: #E0E0E0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 500px;
          width: 100%;
          background-color: #1A1A1A;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          padding: 40px 30px;
          text-align: center;
        }
        
        .icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          background-color: #E63946;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #E0E0E0;
        }
        
        h1 {
          font-size: 24px;
          font-weight: 600;
          color: #E0E0E0;
          margin-bottom: 16px;
        }
        
        .message {
          font-size: 16px;
          color: #9A9A9A;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        
        .suggestion {
          font-size: 14px;
          color: #3AA6F5;
          line-height: 1.5;
          margin-top: 20px;
          padding: 16px;
          background-color: rgba(58, 166, 245, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(58, 166, 245, 0.2);
        }
        
        .back-link {
          display: inline-block;
          margin-top: 24px;
          padding: 12px 24px;
          background-color: #5A31D4;
          color: #E0E0E0;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .back-link:hover {
          background-color: #4a27b0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">⚠</div>
        <h1>${title}</h1>
        <p class="message">${message}</p>
        <div class="suggestion">${suggestion}</div>
        <a href="${config.webRedirectUrl}" class="back-link">Return to Home</a>
      </div>
    </body>
    </html>
  `;
  }
}
