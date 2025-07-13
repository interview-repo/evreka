import userService from "./user.service";

export default async function startServer() {
  await userService.start();
}
