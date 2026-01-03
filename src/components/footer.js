export default function Footer(props) {
  return (
    <div
      className={`${
        props.fixed ? "fixed bottom-0 left-0" : ""
      } w-full text-center text-sm md:text-md text-shadow-[2px_2px_0_black] p-8`}
    >
      © 2026 BLCKK
    </div>
  );
}
