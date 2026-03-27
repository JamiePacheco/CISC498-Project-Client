import { song } from "./Game"

/**Object for lobby playerList userdata*/
export type User = {
  /**For lobbySlices.ts reasons, userID = -1 is system */
  userID: number;
  displayName: string;
  isReady: boolean;
  isSpectator: boolean;
  score: number;
}

export const defaultUser: User = {userID: 0, displayName: "", isReady: false, isSpectator: false, score: 0};

export function createUser(options: Partial<User> = {}): User {
  return {
    ...defaultUser,
    ...options,
  };
}

/**Object for your userdata
 * - Check out defaultMainUser for simpler initialization
*/
export type MainUser = {
  userInfo: User;
  sessionID: number;
  lobbyID: number;
  lastPingTime: String;//Json will send as string, convert it to Date
  loggedIn: boolean;
}
/**Default version of MainUser
 * userInfo: checkout defaultUser,
 * sessionID: 0,
 * lobbyID: 0,
 * lastPingTime: new Date (time of creation)
 */
export const defaultMainUser: MainUser = {userInfo: defaultUser, sessionID: 0, lobbyID: 0, lastPingTime: "", loggedIn: false};

/**Function for creating new instance of MainUser
 * 
 * Default: check out defaultMainUser,
 * With Arguments:
 * createMainUser({sessionID: 50}) creates a defaultMainUser, but with a sessionID of 50 instead of 0
 */
export function createMainUser(options: Partial<MainUser> = {}): MainUser {
  return {
    ...defaultMainUser,
    ...options,
  };
}

/**Object for active players
Player 1 and Player 2**/
export type Player = {
  userInfo: User;
  chosenSong: song;
  votes: number;
}

/**Default Player
 * userInfo: check defaultUser,
 * chosenSong: {title: "", thumbnail: "", url: ""},
 * votes: 0 */
export const defaultPlayer: Player = {userInfo: defaultUser, chosenSong: {title: "", thumbnail: "", url: "", startTimeStamp: 0, endTimeStamp: 15}, votes: 0};

/**Custom Builder for player
 * 
 * Example: const newPlayer = createPlayer({votes: 10}), creates a defaultPlayer with 10 votes, check "defaultPlayer" for parameters
 */
export function createPlayer(options: Partial<Player> = {}): Player {
  return {
    ...defaultPlayer,
    ...options,
  };
}
