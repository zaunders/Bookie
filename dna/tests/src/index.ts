import { Orchestrator, Config } from "@holochain/tryorama";

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const orchestrator = new Orchestrator();

export const simpleConfig = {
  alice: Config.dna("../bookie.dna.gz", null),
  bobbo: Config.dna("../bookie.dna.gz", null),
};

orchestrator.registerScenario(
  "create and get a calendar event",
  async (s, t) => {
    const { conductor } = await s.players({
      conductor: Config.gen(simpleConfig),
    });
    await conductor.spawn();
    
    let calendarEventHash = await conductor.call(
      "alice",
      "calendar_events",
      "create_calendar_event",
      {
        title: "Event 1",
        startTime: [Math.floor(Date.now() / 1000), 0],
        endTime: [Math.floor(Date.now() / 1000) + 1000, 0],
        location: { Custom: "hiii" },
        invitees: [],
      }
    );
    t.ok(calendarEventHash);

    let myProfile = await conductor.call(
      "alice",
      "profiles",
      "get_my_profile",
      null
    );
    t.notOk(myProfile);

  }
);

orchestrator.run();
