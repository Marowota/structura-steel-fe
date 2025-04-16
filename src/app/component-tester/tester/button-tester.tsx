import { Button } from "@/components/elements";

export function ButtonTester() {
  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-2">
          <Button variant={"primary"} size={"lg"}>
            Primary Large
          </Button>
          <Button variant={"primary"} size={"md"}>
            Primary Medium
          </Button>
          <Button variant={"primary"} size={"sm"}>
            Primary Small
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant={"secondary"} size={"lg"}>
            Secondary Large
          </Button>
          <Button variant={"secondary"} size={"md"}>
            Secondary Medium
          </Button>
          <Button variant={"secondary"} size={"sm"}>
            Secondary Small
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant={"tertiary"} size={"lg"}>
            Tertiary Large
          </Button>
          <Button variant={"tertiary"} size={"md"}>
            Tertiary Medium
          </Button>
          <Button variant={"tertiary"} size={"sm"}>
            Tertiary Small
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant={"destructive"} size={"lg"}>
            Danger Large
          </Button>
          <Button variant={"destructive"} size={"md"}>
            Danger Medium
          </Button>
          <Button variant={"destructive"} size={"sm"}>
            Danger Small
          </Button>
        </div>
      </div>
    </>
  );
}
