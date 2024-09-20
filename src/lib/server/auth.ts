import env from "$lib/server/api/common/env";
import { GitHub, Google } from "arctic";

export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);

export const google = new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, `${env.ORIGIN}/auth/callback/google`);