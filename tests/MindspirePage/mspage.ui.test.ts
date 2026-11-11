import { expect, test } from "@playwright/test";
import { PageManager } from "../../src/ui/MindspirePage/page-manager";

test.describe("Mindspire weboldal", () => {
    test.beforeEach(async ({ page }) => {
        page.setDefaultTimeout(30000);
    });

    test("TC-001 - Referenciák link elérhető @type1", async ({ page }) => {
        // A kezdőoldal megnyitása.
        const ms = new PageManager(page);
        const landingPage = ms.mindspireLandingPage;
        await landingPage.openMindspire();
        await expect(landingPage.getMsLogo()).toBeVisible();

        // A Referenciák menüpont elérhetősége.
        const referencesLink = page.locator("#top-menu-nav").getByRole("link", { name: "REFERENCIÁK", exact: true });
        await expect(referencesLink).toBeVisible();
        await expect(referencesLink).toBeEnabled();

        // A Referenciák oldal megnyitása és ellenőrzése.
        await ms.topMenuPage.openNavElement("REFERENCIÁK");
        await expect(page).toHaveURL(/\/referenciaink\/?$/);
        await expect(page.getByRole("heading", {
            level: 1,
            name: /Banki és biztosítói transzformációs referenciáink/i,
        })).toBeVisible();
    });

    test("TC-002 - Hír részletei megnyithatók @type1", async ({ page }) => {
        // A vállalati hírek oldal megnyitása.
        const ms = new PageManager(page);
        await ms.mindspireLandingPage.openMindspire();
        await ms.topMenuPage.openNavElement("Hírek");

        await expect(page).toHaveURL(/\/vallalati-hirek\/?$/);
        await expect(page.getByRole("heading", { level: 1, name: "Vállalati hírek" })).toBeVisible();

        // A kiválasztott hír részleteinek megnyitása.
        const articleTitle = "A MINDSPIRE csatlakozott a Thought Machine Partnerhálózathoz";
        await page.getByRole("heading", { name: articleTitle }).getByRole("link").click();
        await expect(page).toHaveURL(/\/thought-machine-partnerhalozat\/?$/);
        await expect(page.getByRole("heading", { level: 1, name: articleTitle })).toBeVisible();
    });

    test("TC-003 - Karrier jelentkezés megkezdhető beküldés nélkül @type2", async ({ page }) => {
        // A Karrier oldal megnyitása.
        const ms = new PageManager(page);
        await ms.mindspireLandingPage.openMindspire();
        await ms.topMenuPage.openNavElement("KARRIER");
        await expect(page).toHaveURL(/\/karrier\/?$/);
        await expect(page.getByRole("heading", { level: 1, name: /MINDSPIRE Karrier/i })).toBeVisible();

        // A jelentkezési űrlap megnyitása és mezőinek kiválasztása.
        const careerPage = ms.careerPage;
        await careerPage.openRegistration();
        const familyName = careerPage.getFamilyNameInput();
        const givenName = careerPage.getGivenNameInput();
        const email = careerPage.getEmailInput();
        const emailConfirmation = careerPage.getEmailConfirmationInput();
        const phone = careerPage.getPhoneInput();
        const registrationPage = careerPage.getRegistrationPage();

        // Tesztadatok megadása.
        await familyName.fill("Teszt");
        await givenName.fill("Jelentkező");
        await email.fill("teszt@example.com");
        await emailConfirmation.fill("teszt@example.com");
        await phone.fill("+3612345678");

        // A megadott adatok ellenőrzése beküldés nélkül.
        await expect(familyName).toHaveValue("Teszt");
        await expect(givenName).toHaveValue("Jelentkező");
        await expect(email).toHaveValue("teszt@example.com");
        await expect(emailConfirmation).toHaveValue("teszt@example.com");
        await expect(phone).toHaveValue("+3612345678");
        await expect(registrationPage).toHaveURL(/karrier\.mindspire\.hu\/DataCenter\/Registration\/Register\//);
        await page.pause();

        // Visszatérés a Karrier oldalra beküldés nélkül.
        await careerPage.leaveRegistrationWithoutSubmitting();
        await expect(page).toHaveURL(/mindspire\.hu\/karrier\/?$/);
    });

    test("TC-004 - Hibás e-mail cím nem küldhető be @type2", async ({ page }) => {
        // A jelentkezési űrlap megnyitása.
        const ms = new PageManager(page);
        await ms.mindspireLandingPage.openMindspire();
        await ms.topMenuPage.openNavElement("KARRIER");

        const careerPage = ms.careerPage;
        await careerPage.openRegistration();
        await careerPage.preventRegistrationWrites();
        const email = careerPage.getEmailInput();
        const emailConfirmation = careerPage.getEmailConfirmationInput();

        // Hibás e-mail címek megadása és az űrlap beküldése.
        await email.fill("hibas-email");
        await emailConfirmation.fill("hibas-email");
        await careerPage.submitRegistration();

        // A hibás e-mail formátumhoz tartozó hiba ellenőrzése.
        await expect(email).toHaveValue("hibas-email");
        await expect(emailConfirmation).toHaveValue("hibas-email");
        await expect(careerPage.getRegistrationPage()).toHaveURL(/karrier\.mindspire\.hu\/DataCenter\/Registration\/Register\//);
        await expect(careerPage.getRegistrationPage().getByText("Az e-mail formátuma nem megfelelő!", {
            exact: true,
        })).toBeVisible();
        await page.pause();

        // Visszatérés beküldés nélkül.
        await careerPage.leaveRegistrationWithoutSubmitting();
        await expect(page).toHaveURL(/mindspire\.hu\/karrier\/?$/);
    });

    test("TC-005 - Kötelező jelentkezési adatok nélkül nem küldhető be @type2", async ({ page }) => {
        // A jelentkezési űrlap megnyitása.
        const ms = new PageManager(page);
        await ms.mindspireLandingPage.openMindspire();
        await ms.topMenuPage.openNavElement("KARRIER");

        const careerPage = ms.careerPage;
        await careerPage.openRegistration();
        await careerPage.preventRegistrationWrites();

        // A kötelező mezők ürességének ellenőrzése.
        const requiredFields = [
            careerPage.getFamilyNameInput(),
            careerPage.getGivenNameInput(),
            careerPage.getEmailInput(),
            careerPage.getEmailConfirmationInput(),
            careerPage.getPhoneInput(),
        ];

        for (const field of requiredFields) {
            await expect(field).toBeEditable();
            await expect(field).toHaveAttribute("required", "required");
            await expect(field).toHaveValue("");
        }

        // Az üres űrlap beküldési kísérlete.
        await careerPage.submitRegistration();

        // A kötelező mezőkre, fájlra és adatkezelésre vonatkozó hibák ellenőrzése.
        const registrationPage = careerPage.getRegistrationPage();
        await expect(registrationPage.getByText("A mező kitöltése kötelező!", { exact: true })).toHaveCount(7);
        await expect(registrationPage.getByText("Legalább egy file feltöltése kötelező!", { exact: true })).toBeVisible();
        await expect(registrationPage.getByText(
            "Az adatkezelési nyilatkozat elfogadása nélkül sajnos nem regisztrálhat adatbázisunkba!",
            { exact: true },
        )).toBeVisible();
        await expect(careerPage.getRegistrationPage()).toHaveURL(/karrier\.mindspire\.hu\/DataCenter\/Registration\/Register\//);
        await page.pause();

        // Visszatérés beküldés nélkül.
        await careerPage.leaveRegistrationWithoutSubmitting();
        await expect(page).toHaveURL(/mindspire\.hu\/karrier\/?$/);
    });
});