import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

createApp(App)
  .use(router)
  .mount("#app");

import { ProfilesModule } from "@holochain-open-dev/profiles";
import { setupClient } from "./client";

async function initApp() {
  const client = await setupClient(`ws://localhost:8888`);

  const profilesModule = new ProfilesModule({ apolloClient: client });

  await profilesModule.install();
}

initApp();