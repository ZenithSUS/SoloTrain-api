import { StaticExercise } from "../types/workout.js";

export const exercisesByGoal: Record<
  "Build Strength" | "Gain Muscle" | "Lose Fat" | "Maintain",
  StaticExercise[]
> = {
  "Build Strength": [
    {
      name: "Chair Squats",
      shadowName: "Shadow One-Leg Trial",
      exp: 285,
      rank: "D",
      instructions: [
        "Stand in front of a chair with feet shoulder-width apart",
        "Lower hips back until you lightly touch the chair",
        "Keep chest upright and arms extended for balance",
        "Push through your heels to return to standing",
      ],
      targetMuscles: ["Quads", "Glutes", "Core", "Hamstrings"],
      formTips: [
        "Keep knees tracking over toes",
        "Avoid collapsing knees inward",
        "Control movement down and up",
      ],
      modifications: [
        "Use wall support for balance",
        "Pause at the bottom for extra challenge",
      ],
      imageKey: {
        image1: "/assets/images/build_strength/chair_squat.webp",
        image2: "/assets/images/build_strength/chair_squat_tutorial.webp",
      },
    },
    {
      name: "Knee Push-Ups",
      shadowName: "Iron Shadow Manifestation",
      exp: 240,
      rank: "D",
      instructions: [
        "Start in push-up position with knees on the floor",
        "Lower your chest towards the ground by bending elbows",
        "Keep elbows close to your body",
        "Push back up to starting position",
      ],
      targetMuscles: ["Chest", "Triceps", "Shoulders", "Core"],
      formTips: [
        "Keep body straight from knees to head",
        "Do not sag hips",
        "Control each rep slowly",
      ],
      modifications: [
        "Do wall push-ups for even easier version",
        "Progress to full push-ups when ready",
      ],
      imageKey: {
        image1: "/assets/images/build_strength/knee_pushup.webp",
        image2: "/assets/images/build_strength/knee_pushup_tutorial.webp",
      },
    },
    {
      name: "Wall Plank Hold",
      shadowName: "Shadow Monarch's Balance",
      exp: 220,
      rank: "E",
      instructions: [
        "Stand facing a wall",
        "Place forearms on the wall and step feet back slightly",
        "Keep body in a straight line from head to heels",
        "Hold and keep core tight",
      ],
      targetMuscles: ["Shoulders", "Core", "Upper Back"],
      formTips: [
        "Avoid arching your back",
        "Keep elbows under shoulders",
        "Breathe steadily",
      ],
      modifications: [
        "Step closer to the wall for easier hold",
        "Step further for harder hold",
      ],
      imageKey: {
        image1: "/assets/images/build_strength/wall_plank.webp",
        image2: "/assets/images/build_strength/wall_plank_tutorial.webp",
      },
    },
    {
      name: "Incline Push-Ups",
      shadowName: "Iron Fist Protocol",
      exp: 190,
      rank: "D",
      instructions: [
        "Place hands on a chair, wall, or sturdy surface",
        "Lower your chest towards your hands by bending elbows",
        "Push back up to starting position",
        "Keep your body in a straight line",
      ],
      targetMuscles: ["Chest", "Triceps", "Shoulders"],
      formTips: [
        "Keep core engaged",
        "Avoid sagging hips",
        "Maintain steady breathing",
      ],
      modifications: [
        "Wall push-ups for beginners",
        "Lower the surface height for more challenge",
      ],
      imageKey: {
        image1: "/assets/images/build_strength/incline_pushup.webp",
        image2: "/assets/images/build_strength/incline_pushup_tutorial.webp",
      },
    },
    {
      name: "Glute Bridges",
      shadowName: "Shadow Hip Manifestation",
      exp: 135,
      rank: "E",
      instructions: [
        "Lie on your back with knees bent and feet flat on the floor",
        "Lift hips toward the ceiling by squeezing glutes",
        "Hold briefly at the top and lower back down",
        "Keep core engaged throughout",
      ],
      targetMuscles: ["Glutes", "Hamstrings", "Lower Back"],
      formTips: [
        "Avoid arching lower back",
        "Press heels into the ground",
        "Squeeze glutes hard at the top",
      ],
      modifications: [
        "Pause at the top for more tension",
        "Try single-leg glute bridge when stronger",
      ],
      imageKey: {
        image1: "/assets/images/build_strength/glute_bridge.webp",
        image2: "/assets/images/build_strength/glute_bridge_tutorial.webp",
      },
    },
    {
      name: "Wall Shoulder Press",
      shadowName: "Iron Shoulder Manifestation",
      exp: 260,
      rank: "C",
      instructions: [
        "Stand facing a wall with hands on it at shoulder height",
        "Step back slightly and lean into the wall",
        "Bend elbows to lower head towards the wall",
        "Push away to return to start",
      ],
      targetMuscles: ["Shoulders", "Triceps", "Chest"],
      formTips: [
        "Keep core tight",
        "Avoid shrugging shoulders",
        "Move slowly and controlled",
      ],
      modifications: [
        "Stand closer for easier version",
        "Step further for harder version",
      ],
      imageKey: {
        image1: "/assets/images/build_strength/wall_shoulder_press.webp",
        image2:
          "/assets/images/build_strength/wall_shoulder_press_tutorial.webp",
      },
    },
    {
      name: "Static Lunges",
      shadowName: "Shadow Step Trial",
      exp: 175,
      rank: "C",
      instructions: [
        "Stand with one foot forward and one foot back",
        "Bend both knees to lower down",
        "Keep torso upright and weight in front heel",
        "Push back up without moving feet",
      ],
      targetMuscles: ["Quads", "Glutes", "Hamstrings", "Core"],
      formTips: [
        "Keep front knee over ankle",
        "Do not lean forward excessively",
        "Control descent and rise",
      ],
      modifications: [
        "Hold wall or chair for balance",
        "Shorten range of motion if needed",
      ],
      imageKey: {
        image1: "/assets/images/build_strength/static_lunge.webp",
        image2: "/assets/images/build_strength/static_lunge_tutorial.webp",
      },
    },
  ],

  "Gain Muscle": [
    {
      name: "Wall Push-Ups",
      shadowName: "Iron Chest Manifestation",
      exp: 210,
      rank: "E",
      instructions: [
        "Stand an arm's length from a wall with hands slightly wider than shoulders",
        "Bend elbows to bring chest toward the wall",
        "Press back to the start keeping body in a straight line",
        "Maintain a light brace through your core",
      ],
      targetMuscles: ["Upper Chest", "Triceps", "Shoulders", "Core"],
      formTips: [
        "Don't shrug shoulders; keep them down and back",
        "Elbows at roughly 30–45° from your sides",
        "Move slowly with full range of motion",
      ],
      modifications: [
        "Step closer to the wall for easier reps",
        "Step feet further back to increase difficulty",
      ],
      imageKey: {
        image1: "/assets/images/gain_muscle/wall_pushup.webp",
        image2: "/assets/images/gain_muscle/wall_pushup_tutorial.webp",
      },
    },
    {
      name: "Bodyweight Squats",
      shadowName: "Shadow Stability Drill",
      exp: 120,
      rank: "D",
      instructions: [
        "Stand with feet shoulder-width (toes slightly out)",
        "Sit hips back and down to a comfortable depth",
        "Keep chest up and knees tracking over toes",
        "Drive through mid-foot to stand tall",
      ],
      targetMuscles: ["Quads", "Glutes", "Hamstrings"],
      formTips: [
        "Avoid knees collapsing inward",
        "Keep heels down",
        "Maintain a neutral spine",
      ],
      modifications: [
        "Reduce depth to a pain-free range",
        "Slow 3-second lowers for more control",
      ],
      imageKey: {
        image1: "/assets/images/gain_muscle/bodyweight_squat.webp",
        image2: "/assets/images/gain_muscle/bodyweight_squat_tutorial.webp",
      },
    },
    {
      name: "Glute Bridges",
      shadowName: "Shadow Hip Manifestation",
      exp: 145,
      rank: "E",
      instructions: [
        "Lie on your back, knees bent, feet flat hip-width",
        "Squeeze glutes to lift hips until body forms a straight line",
        "Hold briefly at the top",
        "Lower with control without relaxing completely",
      ],
      targetMuscles: ["Glutes", "Hamstrings", "Lower Back"],
      formTips: [
        "Ribs down, don't over-arch the low back",
        "Press evenly through both heels",
        "Exhale as you lift",
      ],
      modifications: [
        "Pause 2–3 seconds at the top",
        "Bring feet closer/farther to change emphasis",
      ],
      imageKey: {
        image1: "/assets/images/gain_muscle/glute_bridge.webp",
        image2: "/assets/images/gain_muscle/glute_bridge_tutorial.webp",
      },
    },
    {
      name: "Knee Diamond Push-Ups",
      shadowName: "Iron Fist Protocol",
      exp: 195,
      rank: "C",
      instructions: [
        "From a knees-down plank, place hands under chest forming a diamond",
        "Lower chest toward hands keeping elbows close",
        "Press back up without letting hips sag",
        "Keep a straight line from knees to head",
      ],
      targetMuscles: ["Triceps", "Chest", "Shoulders"],
      formTips: [
        "Brace core to prevent arching",
        "Move in a controlled tempo",
        "Lock out gently—don't snap elbows",
      ],
      modifications: [
        "Widen hands slightly if wrists feel stressed",
        "Progress to full diamond push-ups when ready",
      ],
      imageKey: {
        image1: "/assets/images/gain_muscle/knee_diamond_pushup.webp",
        image2: "/assets/images/gain_muscle/knee_diamond_pushup_tutorial.webp",
      },
    },
    {
      name: "Split Squats (Static)",
      shadowName: "Shadow Step Trial",
      exp: 180,
      rank: "C",
      instructions: [
        "Take a long stance, one foot forward, one back",
        "Drop straight down by bending both knees",
        "Keep torso tall and front knee over mid-foot",
        "Press through the front heel to rise",
      ],
      targetMuscles: ["Quads", "Glutes", "Hamstrings", "Core"],
      formTips: [
        "Shorten range if you feel knee pressure",
        "Front shin stays mostly vertical",
        "Keep hips square to the front",
      ],
      modifications: [
        "Light fingertip support on a wall for balance",
        "Reduce depth or cadence as needed",
      ],
      imageKey: {
        image1: "/assets/images/gain_muscle/split_squat_static.webp",
        image2: "/assets/images/gain_muscle/split_squat_static_tutorial.webp",
      },
    },
    {
      name: "Pike Hold (Downward Dog Hold)",
      shadowName: "Shadow Monarch's Balance",
      exp: 225,
      rank: "B",
      instructions: [
        "From hands-and-feet position, walk hands back until hips are high",
        "Press chest gently toward thighs and lengthen your spine",
        "Keep head between arms and heels reaching toward the floor",
        "Hold while breathing slowly",
      ],
      targetMuscles: ["Shoulders", "Triceps", "Core", "Upper Back"],
      formTips: [
        "Keep elbows softly locked and shoulders away from ears",
        "Distribute weight between hands and feet",
        "Avoid dumping into the low back",
      ],
      modifications: [
        "Bend knees slightly to keep back long",
        "Shift more weight to feet for easier hold",
      ],
      imageKey: {
        image1: "/assets/images/gain_muscle/pike_hold.webp",
        image2: "/assets/images/gain_muscle/pike_hold_tutorial.webp",
      },
    },
    {
      name: "High Plank Shoulder Taps",
      shadowName: "Iron Shoulder Manifestation",
      exp: 265,
      rank: "B",
      instructions: [
        "Start in a high plank with hands under shoulders",
        "Widen feet for a stable base",
        "Tap left shoulder with right hand, then switch",
        "Keep hips level and core braced the whole time",
      ],
      targetMuscles: ["Shoulders", "Core", "Chest", "Triceps"],
      formTips: [
        "Minimize hip sway—move slow and controlled",
        "Press the floor away to stay protracted",
        "Neck neutral, gaze slightly ahead",
      ],
      modifications: [
        "Elevate hands on a wall for easier taps",
        "Slow the tempo or reduce reps as needed",
      ],
      imageKey: {
        image1: "/assets/images/gain_muscle/plank_shoulder_taps.webp",
        image2: "/assets/images/gain_muscle/plank_shoulder_taps_tutorial.webp",
      },
    },
  ],

  "Lose Fat": [
    {
      name: "Step-Back Burpees",
      shadowName: "Monarch's Rapid Assault",
      exp: 300,
      rank: "A",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Squat down and place hands on the floor",
        "Step one foot back at a time to reach a plank position",
        "Step feet forward again and stand up tall (option: small jump at the top)",
      ],
      targetMuscles: ["Full Body", "Core", "Legs"],
      formTips: [
        "Keep chest lifted when squatting down",
        "Brace core during plank position",
        "Land softly when stepping in/out",
      ],
      modifications: [
        "Skip the jump for easiest version",
        "Add a small hop when standing for more challenge",
      ],
      imageKey: {
        image1: "/assets/images/lose_fat/stepback_burpee.webp",
        image2: "/assets/images/lose_fat/stepback_burpee_tutorial.webp",
      },
    },
    {
      name: "Slow Mountain Climbers",
      shadowName: "Monarch's Rapid Assault",
      exp: 185,
      rank: "C",
      instructions: [
        "Start in high plank with hands under shoulders",
        "Bring one knee slowly toward chest",
        "Step it back and switch sides at a steady pace",
        "Keep hips low and core engaged",
      ],
      targetMuscles: ["Core", "Shoulders", "Hip Flexors"],
      formTips: [
        "Avoid bouncing hips up and down",
        "Keep shoulders stacked over wrists",
        "Move at a controlled rhythm",
      ],
      modifications: [
        "Do standing marches instead of plank version",
        "Speed up gradually as you get stronger",
      ],
      imageKey: {
        image1: "/assets/images/lose_fat/slow_mountain_climbers.webp",
        image2: "/assets/images/lose_fat/slow_mountain_climbers_tutorial.webp",
      },
    },
    {
      name: "Half Jumping Jacks",
      shadowName: "Hunter's Cardio Circuit",
      exp: 140,
      rank: "E",
      instructions: [
        "Stand with feet together and arms at sides",
        "Step one foot out to the side while raising both arms overhead",
        "Step foot back in while lowering arms",
        "Repeat alternating sides in a steady rhythm",
      ],
      targetMuscles: ["Full Body", "Cardio"],
      formTips: [
        "Stay light on your feet",
        "Lift arms to shoulder height if overhead is uncomfortable",
        "Keep breathing steady",
      ],
      modifications: [
        "March in place while raising arms for easiest version",
        "Speed up to increase intensity",
      ],
      imageKey: {
        image1: "/assets/images/lose_fat/half_jumping_jacks.webp",
        image2: "/assets/images/lose_fat/half_jumping_jacks_tutorial.webp",
      },
    },
    {
      name: "Marching High Knees",
      shadowName: "Hunter's Sprint Burst",
      exp: 160,
      rank: "D",
      instructions: [
        "Stand tall with arms at your sides",
        "Lift one knee toward hip height while swinging the opposite arm",
        "Lower and switch to the other side like marching in place",
        "Keep a steady marching pace",
      ],
      targetMuscles: ["Quads", "Hip Flexors", "Core"],
      formTips: [
        "Lift knees as high as comfortable",
        "Stay tall, don't lean back",
        "Breathe in rhythm with steps",
      ],
      modifications: [
        "Do slower marches for beginners",
        "Pick up pace for challenge",
      ],
      imageKey: {
        image1: "/assets/images/lose_fat/marching_high_knees.webp",
        image2: "/assets/images/lose_fat/marching_high_knees_tutorial.webp",
      },
    },
    {
      name: "Side Step Touch",
      shadowName: "Shadow Side Sprint",
      exp: 205,
      rank: "D",
      instructions: [
        "Stand with feet together",
        "Step one foot wide to the side and touch the floor with the same-side hand",
        "Return to center and repeat on the other side",
        "Move side-to-side in a steady rhythm",
      ],
      targetMuscles: ["Glutes", "Quads", "Hamstrings", "Core"],
      formTips: [
        "Bend knees slightly when reaching down",
        "Keep chest lifted",
        "Avoid rounding your back",
      ],
      modifications: [
        "Stay upright and just tap thighs instead of floor",
        "Add a quicker tempo for more intensity",
      ],
      imageKey: {
        image1: "/assets/images/lose_fat/side_step_touch.webp",
        image2: "/assets/images/lose_fat/side_step_touch_tutorial.webp",
      },
    },
    {
      name: "Squat to Calf Raise",
      shadowName: "Shadow Explosive Burst",
      exp: 235,
      rank: "C",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Lower into a squat to a comfortable depth",
        "As you rise, lift heels off the floor onto your toes",
        "Lower heels and repeat",
      ],
      targetMuscles: ["Quads", "Glutes", "Hamstrings", "Calves"],
      formTips: [
        "Keep chest upright",
        "Push evenly through the balls of your feet when rising",
        "Don't let knees cave inward",
      ],
      modifications: [
        "Reduce squat depth for easier version",
        "Hold calf raise for 2 seconds for more challenge",
      ],
      imageKey: {
        image1: "/assets/images/lose_fat/squat_calf_raise.webp",
        image2: "/assets/images/lose_fat/squat_calf_raise_tutorial.webp",
      },
    },
    {
      name: "Step-Out Plank",
      shadowName: "Core Circuit Burst",
      exp: 170,
      rank: "C",
      instructions: [
        "Start in high plank with feet together",
        "Step one foot out to the side, then back in",
        "Repeat with the other foot",
        "Keep hips level and core braced throughout",
      ],
      targetMuscles: ["Core", "Shoulders", "Cardio"],
      formTips: [
        "Avoid dropping hips",
        "Move feet quietly and controlled",
        "Neck neutral, gaze slightly forward",
      ],
      modifications: [
        "Do the same move on forearms if wrists get tired",
        "Speed up slightly for a cardio boost",
      ],
      imageKey: {
        image1: "/assets/images/lose_fat/stepout_plank.webp",
        image2: "/assets/images/lose_fat/stepout_plank_tutorial.webp",
      },
    },
  ],

  Maintain: [
    {
      name: "Wall Sit",
      shadowName: "Guardian's Patience",
      exp: 200,
      rank: "D",
      instructions: [
        "Stand with your back against a wall",
        "Slide down until knees are bent around 90 degrees",
        "Keep feet flat and arms relaxed at sides or on thighs",
        "Hold position steadily for the set duration",
      ],
      targetMuscles: ["Quads", "Glutes", "Core"],
      formTips: [
        "Keep lower back pressed into the wall",
        "Don't let knees go past toes",
        "Breathe slowly to stay relaxed",
      ],
      modifications: [
        "Hold higher (less bend in knees) for easier version",
        "Cross arms over chest for more challenge",
      ],
      imageKey: {
        image1: "/assets/images/maintain/wall_sit.webp",
        image2: "/assets/images/maintain/wall_sit_tutorial.webp",
      },
    },
    {
      name: "Knee Push-Ups",
      shadowName: "Guardian's Steady Strike",
      exp: 180,
      rank: "D",
      instructions: [
        "Start on hands and knees with hands under shoulders",
        "Walk hands slightly forward and lower hips in line with shoulders",
        "Bend elbows to lower chest toward the floor",
        "Push back up to starting position",
      ],
      targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
      formTips: [
        "Keep body straight from knees to head",
        "Lower in a controlled way",
        "Avoid flaring elbows too wide",
      ],
      modifications: [
        "Do wall push-ups for an easier version",
        "Pause 1 second at the bottom for more challenge",
      ],
      imageKey: {
        image1: "/assets/images/maintain/knee_pushup.webp",
        image2: "/assets/images/maintain/knee_pushup_tutorial.webp",
      },
    },
    {
      name: "Glute Bridge Hold",
      shadowName: "Guardian's Core Link",
      exp: 160,
      rank: "E",
      instructions: [
        "Lie on your back with knees bent and feet flat on floor",
        "Press through heels to lift hips off the floor",
        "Keep body in a straight line from shoulders to knees",
        "Hold this position, squeezing glutes and core",
      ],
      targetMuscles: ["Glutes", "Hamstrings", "Core"],
      formTips: [
        "Don't arch lower back too much",
        "Squeeze glutes at the top",
        "Keep knees aligned with hips",
      ],
      modifications: [
        "Hold for shorter time if needed",
        "March one leg at a time for added challenge",
      ],
      imageKey: {
        image1: "/assets/images/maintain/glute_bridge_hold.webp",
        image2: "/assets/images/maintain/glute_bridge_hold_tutorial.webp",
      },
    },
    {
      name: "Seated Leg Extensions",
      shadowName: "Guardian's Leg Flow",
      exp: 150,
      rank: "E",
      instructions: [
        "Sit on a chair with feet flat on floor",
        "Straighten one leg out in front of you",
        "Hold briefly, then lower back down",
        "Alternate legs at a steady pace",
      ],
      targetMuscles: ["Quads", "Hip Flexors"],
      formTips: [
        "Sit tall without leaning back",
        "Lift to a comfortable height",
        "Avoid swinging legs too fast",
      ],
      modifications: [
        "Use both legs together for easier version",
        "Add ankle weights for more challenge (optional)",
      ],
      imageKey: {
        image1: "/assets/images/maintain/seated_leg_extensions.webp",
        image2: "/assets/images/maintain/seated_leg_extensions_tutorial.webp",
      },
    },
    {
      name: "Standing Side Leg Raises",
      shadowName: "Guardian's Balance Test",
      exp: 170,
      rank: "D",
      instructions: [
        "Stand tall with hands on hips or chair for support",
        "Lift one leg out to the side slowly",
        "Lower with control and repeat",
        "Switch sides after reps",
      ],
      targetMuscles: ["Glutes", "Outer Thighs", "Core"],
      formTips: [
        "Keep torso upright",
        "Don't lean sideways",
        "Lift only as high as comfortable",
      ],
      modifications: [
        "Do smaller lifts for easier version",
        "Hold leg at the top for more challenge",
      ],
      imageKey: {
        image1: "/assets/images/maintain/standing_side_leg_raise.webp",
        image2: "/assets/images/maintain/standing_side_leg_raise_tutorial.webp",
      },
    },
    {
      name: "Seated Arm Circles",
      shadowName: "Guardian's Flow",
      exp: 140,
      rank: "E",
      instructions: [
        "Sit or stand with arms extended out to the sides",
        "Make small forward circles with arms",
        "Continue for half the time, then switch to backward circles",
        "Keep arms lifted at shoulder height",
      ],
      targetMuscles: ["Shoulders", "Arms", "Upper Back"],
      formTips: [
        "Keep movements small and controlled",
        "Don't shrug shoulders",
        "Stay steady without swinging arms",
      ],
      modifications: [
        "Rest arms briefly if they get tired",
        "Increase circle size for added challenge",
      ],
      imageKey: {
        image1: "/assets/images/maintain/seated_arm_circles.webp",
        image2: "/assets/images/maintain/seated_arm_circles_tutorial.webp",
      },
    },
    {
      name: "Cat-Cow Stretch",
      shadowName: "Guardian's Flow Balance",
      exp: 120,
      rank: "E",
      instructions: [
        "Start on hands and knees with wrists under shoulders",
        "Arch your back slowly upward (Cat pose)",
        "Then drop belly down and lift chest/head (Cow pose)",
        "Move slowly between poses while breathing deeply",
      ],
      targetMuscles: ["Back", "Core", "Spine Mobility"],
      formTips: [
        "Move with your breath (inhale cow, exhale cat)",
        "Keep motion smooth and controlled",
        "Relax shoulders away from ears",
      ],
      modifications: [
        "Do seated version if kneeling is uncomfortable",
        "Hold each pose longer for relaxation",
      ],
      imageKey: {
        image1: "/assets/images/maintain/cat_cow_stretch.webp",
        image2: "/assets/images/maintain/cat_cow_stretch_tutorial.webp",
      },
    },
  ],
};

export default exercisesByGoal;
