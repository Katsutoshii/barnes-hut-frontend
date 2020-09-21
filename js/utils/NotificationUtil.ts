export function hideOnClickGalaxy(id: string) {
  const galaxy = document.body.querySelector("#galaxy");
  galaxy.addEventListener(
    "click",
    function clicked() {
      document.body.querySelector("#" + id).classList.add("out");
      galaxy.removeEventListener("click", clicked, false);
    },
    false
  );
}
