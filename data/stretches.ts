import { Stretch, Filters } from "../types";

export const stretches: Stretch[] = [
  {
    name: "Neck Roll",
    muscleGroups: ["neck"],
    seconds: 30,
    dynamic: true,
    duration: "30 seconds",
    description: "Slowly roll your head in a circle, 5 times each direction.",
  },
  {
    name: "Shoulder Shrugs",
    muscleGroups: ["shoulders", "neck"],
    seconds: 30,
    dynamic: true,
    duration: "30 seconds",
    description: "Raise shoulders to ears, hold 3 seconds, release. Repeat 10 times.",
  },
  {
    name: "Wrist Circles",
    muscleGroups: ["forearms-wrists"],
    seconds: 20,
    dynamic: true,
    duration: "20 seconds",
    description: "Rotate wrists in circles, 10 times each direction.",
  },
  {
    name: "Seated Spinal Twist",
    muscleGroups: ["back", "core", "hips"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per side",
    description: "Sit tall, twist torso to one side, hold, then switch. Hold each side.",
  },
  {
    name: "Standing Quad Stretch",
    muscleGroups: ["quads", "hips"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per leg",
    description: "Stand on one leg, pull other foot to glutes. Hold each leg.",
  },
  {
    name: "Chest Opener",
    muscleGroups: ["chest", "shoulders"],
    seconds: 20,
    dynamic: false,
    duration: "20 seconds",
    description: "Clasp hands behind back, lift arms and open chest. Hold.",
  },
  {
    name: "Forward Fold",
    muscleGroups: ["hamstrings", "lower-back", "calves"],
    seconds: 30,
    dynamic: false,
    duration: "30 seconds",
    description: "Stand with feet hip-width, fold forward and let arms hang. Relax.",
  },
  {
    name: "Cat-Cow Stretch",
    muscleGroups: ["back", "core", "neck"],
    seconds: 60,
    dynamic: true,
    duration: "1 minute",
    description: "On hands and knees, alternate arching and rounding your back.",
  },
  {
    name: "Figure Four Stretch",
    muscleGroups: ["hips", "glutes", "lower-back"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per side",
    description: "Lie on back, cross ankle over opposite knee, pull legs toward chest.",
  },
  {
    name: "Tricep Stretch",
    muscleGroups: ["triceps", "shoulders"],
    seconds: 40,
    dynamic: false,
    duration: "20 seconds per arm",
    description: "Raise arm overhead, bend elbow, use other hand to gently push elbow down.",
  },
  {
    name: "Chin Tuck",
    muscleGroups: ["neck"],
    seconds: 20,
    dynamic: false,
    duration: "20 seconds",
    description: "Pull chin straight back, creating a double chin. Hold and release.",
  },
  {
    name: "Side Neck Stretch",
    muscleGroups: ["neck", "shoulders"],
    seconds: 40,
    dynamic: false,
    duration: "20 seconds per side",
    description: "Tilt ear toward shoulder, gently press with hand. Hold each side.",
  },
  {
    name: "Shoulder Rolls",
    muscleGroups: ["shoulders", "neck", "upper-back"],
    seconds: 30,
    dynamic: true,
    duration: "30 seconds",
    description: "Roll shoulders forward 10 times, then backward 10 times.",
  },
  {
    name: "Cross-Body Shoulder Stretch",
    muscleGroups: ["shoulders", "upper-back"],
    seconds: 40,
    dynamic: false,
    duration: "20 seconds per arm",
    description: "Pull one arm across your chest with the other hand. Hold each side.",
  },
  {
    name: "Doorway Chest Stretch",
    muscleGroups: ["chest", "shoulders", "biceps"],
    seconds: 45,
    dynamic: false,
    duration: "45 seconds",
    description: "Place forearm on door frame, step through and rotate chest away.",
  },
  {
    name: "Prayer Stretch",
    muscleGroups: ["forearms-wrists", "chest"],
    seconds: 30,
    dynamic: false,
    duration: "30 seconds",
    description: "Press palms together in front of chest, lower hands while keeping palms together.",
  },
  {
    name: "Finger Extensor Stretch",
    muscleGroups: ["forearms-wrists"],
    seconds: 30,
    dynamic: false,
    duration: "15 seconds per hand",
    description: "Extend arm, pull fingers back gently with other hand.",
  },
  {
    name: "Bicep Stretch",
    muscleGroups: ["biceps", "chest", "shoulders"],
    seconds: 40,
    dynamic: false,
    duration: "20 seconds per arm",
    description: "Extend arm to wall at shoulder height, rotate body away from arm.",
  },
  {
    name: "Child's Pose",
    muscleGroups: ["back", "shoulders", "hips"],
    seconds: 60,
    dynamic: false,
    duration: "1 minute",
    description: "Kneel, sit back on heels, extend arms forward on the floor. Breathe deeply.",
  },
  {
    name: "Thread the Needle",
    muscleGroups: ["upper-back", "shoulders", "neck"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per side",
    description: "On all fours, slide one arm under body, rotating spine. Hold each side.",
  },
  {
    name: "Cobra Stretch",
    muscleGroups: ["core", "chest", "back"],
    seconds: 30,
    dynamic: false,
    duration: "30 seconds",
    description: "Lie face down, push chest up with arms while keeping hips on floor.",
  },
  {
    name: "Standing Calf Stretch",
    muscleGroups: ["calves", "hamstrings"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per leg",
    description: "Step one foot back, press heel down, lean into wall. Hold each leg.",
  },
  {
    name: "Seated Hamstring Stretch",
    muscleGroups: ["hamstrings", "lower-back", "calves"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per leg",
    description: "Sit with one leg extended, reach toward toes. Hold each leg.",
  },
  {
    name: "Pigeon Pose",
    muscleGroups: ["hips", "glutes", "lower-back"],
    seconds: 90,
    dynamic: false,
    duration: "45 seconds per side",
    description: "From all fours, bring one knee forward and extend other leg back. Fold forward.",
  },
  {
    name: "Hip Flexor Lunge",
    muscleGroups: ["hips", "quads", "core"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per side",
    description: "Kneel in lunge position, push hips forward while keeping torso upright.",
  },
  {
    name: "Butterfly Stretch",
    muscleGroups: ["hips", "glutes", "inner-thighs"],
    seconds: 45,
    dynamic: false,
    duration: "45 seconds",
    description: "Sit with soles of feet together, gently press knees toward floor.",
  },
  {
    name: "Supine Twist",
    muscleGroups: ["back", "core", "hips", "glutes"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per side",
    description: "Lie on back, drop knees to one side while keeping shoulders flat.",
  },
  {
    name: "Wall Chest Stretch",
    muscleGroups: ["chest", "shoulders"],
    seconds: 40,
    dynamic: false,
    duration: "20 seconds per side",
    description: "Place palm on wall at shoulder height, turn body away until stretch is felt.",
  },
  {
    name: "Eagle Arms",
    muscleGroups: ["shoulders", "upper-back"],
    seconds: 40,
    dynamic: false,
    duration: "20 seconds per side",
    description: "Cross arms at elbows, wrap forearms, lift elbows while dropping shoulders.",
  },
  {
    name: "Standing IT Band Stretch",
    muscleGroups: ["hips", "outer-thighs", "glutes"],
    seconds: 60,
    dynamic: false,
    duration: "30 seconds per side",
    description: "Cross one leg behind the other, lean away from back leg until stretch is felt.",
  },
  {
    name: "Ankle Circles",
    muscleGroups: ["ankles", "calves"],
    seconds: 40,
    dynamic: true,
    duration: "20 seconds per ankle",
    description: "Lift foot off ground, rotate ankle in circles. 10 each direction per ankle.",
  },
  {
    name: "Kneeling Wrist Stretch",
    muscleGroups: ["forearms-wrists"],
    seconds: 30,
    dynamic: false,
    duration: "30 seconds",
    description: "On all fours, turn hands so fingers point toward knees. Lean back gently.",
  },
];

export const muscleGroups = [
  ...new Set(stretches.flatMap((s) => s.muscleGroups)),
].sort();

export function filterStretches(allStretches: Stretch[], filters: Filters): Stretch[] {
  let result = allStretches;

  if (filters.muscleGroup) {
    result = result.filter((s) => s.muscleGroups.includes(filters.muscleGroup!));
  }

  if (filters.minSeconds !== null) {
    result = result.filter((s) => s.seconds >= filters.minSeconds!);
  }

  if (filters.maxSeconds !== null) {
    result = result.filter((s) => s.seconds <= filters.maxSeconds!);
  }

  if (filters.type === "dynamic") {
    result = result.filter((s) => s.dynamic);
  } else if (filters.type === "static") {
    result = result.filter((s) => !s.dynamic);
  }

  return result;
}

export function getRandomStretch(filteredStretches: Stretch[]): Stretch | null {
  if (filteredStretches.length === 0) return null;
  return filteredStretches[Math.floor(Math.random() * filteredStretches.length)];
}
