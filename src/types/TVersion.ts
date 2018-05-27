export type TVersion = Readonly<{
  release: string;
  /**
   * can be empty ""
   */
  playtest: string;
  known_versions: string[];
}>;
