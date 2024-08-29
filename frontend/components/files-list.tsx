interface Props {
  accessToken: string;
}

export default function FilesList({ accessToken }: Props) {
  return (
    <div>
      <p>Access token: {accessToken}</p>
    </div>
  );
}
