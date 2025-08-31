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
      imageKey: "chair_squat_01",
    },
    {
      name: "Knee Push-Ups",
      shadowName: "Iron Shadow Manifestation",
      exp: 240,
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
      imageKey: "knee_pushup_01",
    },
    {
      name: "Wall Plank Hold",
      shadowName: "Shadow Monarch's Balance",
      exp: 220,
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
      imageKey: "wall_plank_01",
    },
    {
      name: "Incline Push-Ups",
      shadowName: "Iron Fist Protocol",
      exp: 190,
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
      imageKey: "incline_pushup_01",
    },
    {
      name: "Glute Bridges",
      shadowName: "Shadow Hip Manifestation",
      exp: 135,
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
      imageKey: "glute_bridge_01",
    },
    {
      name: "Wall Shoulder Press",
      shadowName: "Iron Shoulder Manifestation",
      exp: 260,
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
      imageKey: "wall_shoulder_press_01",
    },
    {
      name: "Static Lunges",
      shadowName: "Shadow Step Trial",
      exp: 175,
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
      imageKey: "static_lunge_01",
    },
  ],

  "Gain Muscle": [
    {
      name: "Wall Push-Ups",
      shadowName: "Iron Chest Manifestation",
      exp: 210,
      instructions: [
        "Stand an arm’s length from a wall with hands slightly wider than shoulders",
        "Bend elbows to bring chest toward the wall",
        "Press back to the start keeping body in a straight line",
        "Maintain a light brace through your core",
      ],
      targetMuscles: ["Upper Chest", "Triceps", "Shoulders", "Core"],
      formTips: [
        "Don’t shrug shoulders; keep them down and back",
        "Elbows at roughly 30–45° from your sides",
        "Move slowly with full range of motion",
      ],
      modifications: [
        "Step closer to the wall for easier reps",
        "Step feet further back to increase difficulty",
      ],
      imageKey: "wall_pushup_01",
    },
    {
      name: "Bodyweight Squats",
      shadowName: "Shadow Stability Drill",
      exp: 120,
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
      imageKey: "bodyweight_squat_01",
    },
    {
      name: "Glute Bridges",
      shadowName: "Shadow Hip Manifestation",
      exp: 145,
      instructions: [
        "Lie on your back, knees bent, feet flat hip-width",
        "Squeeze glutes to lift hips until body forms a straight line",
        "Hold briefly at the top",
        "Lower with control without relaxing completely",
      ],
      targetMuscles: ["Glutes", "Hamstrings", "Lower Back"],
      formTips: [
        "Ribs down, don’t over-arch the low back",
        "Press evenly through both heels",
        "Exhale as you lift",
      ],
      modifications: [
        "Pause 2–3 seconds at the top",
        "Bring feet closer/farther to change emphasis",
      ],
      imageKey: "glute_bridge_01",
    },
    {
      name: "Knee Diamond Push-Ups",
      shadowName: "Iron Fist Protocol",
      exp: 195,
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
        "Lock out gently—don’t snap elbows",
      ],
      modifications: [
        "Widen hands slightly if wrists feel stressed",
        "Progress to full diamond push-ups when ready",
      ],
      imageKey: "knee_diamond_pushup_01",
    },
    {
      name: "Split Squats (Static)",
      shadowName: "Shadow Step Trial",
      exp: 180,
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
      imageKey: "split_squat_static_01",
    },
    {
      name: "Pike Hold (Downward Dog Hold)",
      shadowName: "Shadow Monarch's Balance",
      exp: 225,
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
      imageKey: "pike_hold_01",
    },
    {
      name: "High Plank Shoulder Taps",
      shadowName: "Iron Shoulder Manifestation",
      exp: 265,
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
      imageKey: "plank_shoulder_taps_01",
    },
  ],

  "Lose Fat": [
    {
      name: "Step-Back Burpees",
      shadowName: "Monarch's Rapid Assault",
      exp: 300,
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
      imageKey: "stepback_burpee_01",
    },
    {
      name: "Slow Mountain Climbers",
      shadowName: "Monarch's Rapid Assault",
      exp: 185,
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
      imageKey: "slow_mountain_climbers_01",
    },
    {
      name: "Half Jumping Jacks",
      shadowName: "Hunter's Cardio Circuit",
      exp: 140,
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
      imageKey: "half_jumping_jacks_01",
    },
    {
      name: "Marching High Knees",
      shadowName: "Hunter's Sprint Burst",
      exp: 160,
      instructions: [
        "Stand tall with arms at your sides",
        "Lift one knee toward hip height while swinging the opposite arm",
        "Lower and switch to the other side like marching in place",
        "Keep a steady marching pace",
      ],
      targetMuscles: ["Quads", "Hip Flexors", "Core"],
      formTips: [
        "Lift knees as high as comfortable",
        "Stay tall, don’t lean back",
        "Breathe in rhythm with steps",
      ],
      modifications: [
        "Do slower marches for beginners",
        "Pick up pace for challenge",
      ],
      imageKey: "marching_high_knees_01",
    },
    {
      name: "Side Step Touch",
      shadowName: "Shadow Side Sprint",
      exp: 205,
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
      imageKey: "side_step_touch_01",
    },
    {
      name: "Squat to Calf Raise",
      shadowName: "Shadow Explosive Burst",
      exp: 235,
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
        "Don’t let knees cave inward",
      ],
      modifications: [
        "Reduce squat depth for easier version",
        "Hold calf raise for 2 seconds for more challenge",
      ],
      imageKey: "squat_calf_raise_01",
    },
    {
      name: "Step-Out Plank",
      shadowName: "Core Circuit Burst",
      exp: 170,
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
      imageKey: "stepout_plank_01",
    },
  ],

  Maintain: [
    {
      name: "Wall Sit",
      shadowName: "Guardian's Patience",
      exp: 200,
      instructions: [
        "Stand with your back against a wall",
        "Slide down until knees are bent around 90 degrees",
        "Keep feet flat and arms relaxed at sides or on thighs",
        "Hold position steadily for the set duration",
      ],
      targetMuscles: ["Quads", "Glutes", "Core"],
      formTips: [
        "Keep lower back pressed into the wall",
        "Don’t let knees go past toes",
        "Breathe slowly to stay relaxed",
      ],
      modifications: [
        "Hold higher (less bend in knees) for easier version",
        "Cross arms over chest for more challenge",
      ],
      imageKey: "wall_sit_01",
    },
    {
      name: "Knee Push-Ups",
      shadowName: "Guardian's Steady Strike",
      exp: 180,
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
      imageKey: "knee_pushups_01",
    },
    {
      name: "Glute Bridge Hold",
      shadowName: "Guardian's Core Link",
      exp: 160,
      instructions: [
        "Lie on your back with knees bent and feet flat on floor",
        "Press through heels to lift hips off the floor",
        "Keep body in a straight line from shoulders to knees",
        "Hold this position, squeezing glutes and core",
      ],
      targetMuscles: ["Glutes", "Hamstrings", "Core"],
      formTips: [
        "Don’t arch lower back too much",
        "Squeeze glutes at the top",
        "Keep knees aligned with hips",
      ],
      modifications: [
        "Hold for shorter time if needed",
        "March one leg at a time for added challenge",
      ],
      imageKey: "glute_bridge_hold_01",
    },
    {
      name: "Seated Leg Extensions",
      shadowName: "Guardian's Leg Flow",
      exp: 150,
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
      imageKey: "seated_leg_extensions_01",
    },
    {
      name: "Standing Side Leg Raises",
      shadowName: "Guardian's Balance Test",
      exp: 170,
      instructions: [
        "Stand tall with hands on hips or chair for support",
        "Lift one leg out to the side slowly",
        "Lower with control and repeat",
        "Switch sides after reps",
      ],
      targetMuscles: ["Glutes", "Outer Thighs", "Core"],
      formTips: [
        "Keep torso upright",
        "Don’t lean sideways",
        "Lift only as high as comfortable",
      ],
      modifications: [
        "Do smaller lifts for easier version",
        "Hold leg at the top for more challenge",
      ],
      imageKey: "standing_side_leg_raise_01",
    },
    {
      name: "Seated Arm Circles",
      shadowName: "Guardian's Flow",
      exp: 140,
      instructions: [
        "Sit or stand with arms extended out to the sides",
        "Make small forward circles with arms",
        "Continue for half the time, then switch to backward circles",
        "Keep arms lifted at shoulder height",
      ],
      targetMuscles: ["Shoulders", "Arms", "Upper Back"],
      formTips: [
        "Keep movements small and controlled",
        "Don’t shrug shoulders",
        "Stay steady without swinging arms",
      ],
      modifications: [
        "Rest arms briefly if they get tired",
        "Increase circle size for added challenge",
      ],
      imageKey: "seated_arm_circles_01",
    },
    {
      name: "Cat-Cow Stretch",
      shadowName: "Guardian's Flow Balance",
      exp: 120,
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
      imageKey: "cat_cow_stretch_01",
    },
  ],
};

export default exercisesByGoal;
