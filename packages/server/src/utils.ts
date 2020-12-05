import { validateBehavior, Behavior } from "@sayjava/behave-engine";

export const parseBehaviors = (behaviors: string): Behavior[] => {
  const strBehaviors: any[] = JSON.parse(behaviors);

  if (!Array.isArray(strBehaviors)) {
    throw new Error("Behaviors must be an array");
  }
  const validatedBehaviors = strBehaviors.map(validateBehavior);
  return validatedBehaviors;
};
