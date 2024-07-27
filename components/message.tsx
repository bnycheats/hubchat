function Message(props: MessageProps) {
  const { title, message } = props;
  return (
    <div className="flex gap-2 m-auto text-center max-w-sm flex-col justify-center absolute inset-0">
      {title && <h1 className="text-xl font-medium">{title}</h1>}
      {message && <p>{message}</p>}
    </div>
  );
}

type MessageProps = {
  title?: string;
  message?: string;
};

export default Message;
