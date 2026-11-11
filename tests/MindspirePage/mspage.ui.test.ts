import { expect, test } from "@playwright/test";
import { PageManager } from "../../src/ui/MindspirePage/page-manager";
//import { promises as fs } from "fs";
//import * as path from "path";

test.describe("Test", () => {
    let ms: PageManager;
    const interval = 5000;
//    const outDir = path.resolve(process.cwd(), "testData");
//    const flagFile = path.join(outDir, "runflag.json");
    
    test.beforeEach(async ({ page }) => {
        page.setDefaultTimeout(30000);

    });

    test("TC-001 - Referenciák link elérhető @type1", async ({ page }) => {
        // npx playwright test --grep "TC-001"
        // npx playwright test tests\MindspirePage\mspage.ui.test.ts
        // npx playwright test --grep @type1
        console.log(`TC-001`);

        ms = new PageManager(page);

        // open landing page
        let landingPage = ms.mindspireLandingPage;
        await landingPage.openMindspire();
        await expect(landingPage.getMsLogo()).toBeVisible();

        // check "REFERENCIÁK" page link
        let topMenuPage = ms.topMenuPage;
        await topMenuPage.openNavElement("REFERENCIÁK");
        await expect(page).toHaveURL(/.*referenciak/);
        await expect(page.locator("//h1[contains(text(),'referenciáink')]")).toBeVisible();


    });

    test("TC-002 - Másik teszt @type1", async ({ page }) => {
        console.log(`TC-002`);


    });

});