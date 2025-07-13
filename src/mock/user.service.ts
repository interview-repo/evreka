import { fakerTR as faker } from "@faker-js/faker";
import { UserSchema, UserRoleOptions, type User } from "@/types/user";
import { MockServer } from "./generator";

export default new MockServer<User>(
  "users",
  UserSchema,
  () => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      role: faker.helpers.arrayElement(UserRoleOptions),
      active: faker.datatype.boolean(0.8),
      location: {
        latitude: faker.location.latitude({ min: 39.7, max: 40.1 }),
        longitude: faker.location.longitude({ min: 32.5, max: 33.0 }),
      },
    };
  },
  5_000
);
