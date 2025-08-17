import { TermsOfUse } from "@md/core/domain/terms-of-use";

export type TermsOfUseRepository = {
  filter: (args: { ids?: TermsOfUse["id"][] }) => Promise<TermsOfUse[] | Error>;
  findLatest: () => Promise<TermsOfUse[] | Error>;
  save: (args: TermsOfUse) => Promise<TermsOfUse | Error>;
};
