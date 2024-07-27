import { forwardRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { Input, type InputProps } from "@/components/ui/input";

const Password = forwardRef<HTMLInputElement, PasswordProps>(function Password(
  props,
  ref
) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div className="relative">
      <Input ref={ref} type={showPassword ? "text" : "password"} {...props} />
      <span
        className="absolute right-4 top-1/2 -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </span>
    </div>
  );
});

type PasswordProps = Omit<InputProps, "type" | "ref">;

export default Password;
