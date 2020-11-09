import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import { ProfilesModule } from "@holochain-open-dev/profiles";
import { setupClient } from "./client";

async function initApp() {
  const client = await setupClient(`ws://localhost:8888`);

  // TODO: does this go here? Should we show a spinner?
  const app = createApp(App);
  app.use(router).mount("#app");
  app.config.globalProperties.client = client;

  const profilesModule = new ProfilesModule({ apolloClient: client });

  await profilesModule.install();
}

initApp();
