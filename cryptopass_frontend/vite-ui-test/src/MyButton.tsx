import { AwesomeButton } from "react-awesome-button";
// import "react-awesome-button/dist/styles_rick.css";
// import "react-awesome-button/dist/styles.css";
type props = {
  label: string;
  isDisabled: boolean | null | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  clickHandler: Function;
};

function MyButton({ label, isDisabled, clickHandler }: props) {
  let isActive: boolean = true;
  if (isDisabled === undefined) isActive = false;
  if (isDisabled === null) isActive = false;
  //   if (isDisabled !== undefined && isDisabled !== null) isActive = true;

  return (
    <AwesomeButton
      //   cssModule={AwesomeButtonStyles}
      type=""
      style={{ color: !isActive ? "red" : "limegreen" }}
      disabled={!isActive}
      onPress={() => {
        console.log("🎁 Request SBT Handler");
        clickHandler();
        // do something
      }}
    >
      {label}
    </AwesomeButton>
  );
}

export default MyButton;
