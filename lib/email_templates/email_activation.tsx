import React from "react";

type EmailActivationProps = Readonly<{
  url: string;
  host: string;
  name: string | null;
}>;

export function EmailActivationTemplate({
  url,
  host,
  name,
}: EmailActivationProps) {
  return (
    <div className="prose">
      <h1>Hi {name ?? "Friend"},</h1>
      <p>
        You&apos;re almost there! To activate your account, please click the
        link below:
        <a href={url} className="text-blue-500 underline">
          {url}
        </a>
        <br />
        <br />
        If you have any questions, please don&apos;t hesitate to contact us at
        <a href={`mailto:support@${host}`} className="text-blue-500 underline">
          support@{host}
        </a>
        .
        <br />
        <br />
        Thanks,
        <br />
        The {host} Team
      </p>
    </div>
  );
}
