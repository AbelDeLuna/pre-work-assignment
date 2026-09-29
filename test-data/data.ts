function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}.`);
  }
  return value;
}

// Retrieves the username and password for a given user from environment variables
// env variables are used to prevent sensitive information from being hardcoded into the codebase
export function getCredentials(user: string) {
  return {
    username: requireEnv(`${user}_USERNAME`),
    password: requireEnv(`${user}_PASSWORD`),
  };
}

export const users = {
  standard: getCredentials('STANDARD'),
  lockedOut: getCredentials('LOCKED_OUT'),
  problem: getCredentials('PROBLEM'),
  performanceGlitch: getCredentials('PERFORMANCE_GLITCH'),
  error: getCredentials('ERROR'),
  visual: getCredentials('VISUAL'),
  invalid: getCredentials('INVALID'),
};

export const products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',},
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
  },
  onesie: {
    name: 'Sauce Labs Onesie',
    price: '$7.99',
  },
  redTShirt: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: '$15.99',
  }
};

export const customer = {
  firstName: 'Human',
  lastName: 'Person',
  postalCode: '98103',
};
