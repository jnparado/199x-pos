import Image from "next/image";

type LogoProps = {
  size?: "login" | "nav" | "mark" | "hero";
};

export function Logo({ size = "nav" }: LogoProps) {
  if (size === "hero") {
    return (
      <Image
        src="/199x-logo.jpg"
        alt="199X Coffee+Bar"
        width={640}
        height={640}
        priority
        className="mx-auto h-auto w-full max-w-[220px] rounded-[2rem] object-contain shadow-[0_0_50px_rgba(212,175,55,0.28)] sm:max-w-[280px] lg:max-w-[360px]"
      />
    );
  }

  if (size === "login") {
    return (
      <Image
        src="/199x-logo.jpg"
        alt="199X Coffee+Bar"
        width={480}
        height={480}
        priority
        className="mx-auto h-auto w-full max-w-[11rem] rounded-[1.6rem] object-contain sm:max-w-[14rem]"
      />
    );
  }

  if (size === "mark") {
    return (
      <Image
        src="/199x-logo.jpg"
        alt="199X"
        width={48}
        height={48}
        className="h-9 w-9 rounded-xl object-cover sm:h-10 sm:w-10"
      />
    );
  }

  return (
    <Image
      src="/199x-logo.jpg"
      alt="199X Coffee+Bar"
      width={220}
      height={220}
      className="mx-auto h-auto w-full max-w-[9.5rem] rounded-2xl object-contain"
    />
  );
}
