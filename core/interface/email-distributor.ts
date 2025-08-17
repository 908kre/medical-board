import { Result } from "@md/core/result";
import { Email } from "@md/core/domain/email";

export type EmailDistributor = {
  send: (props: {
    toAddress: Email;
    subject: string;
    text: string;
  }) => Promise<Result<void>>;
};
