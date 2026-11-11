import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/base-page";

export class CareerPage extends BasePage {
    private registrationPage?: Page;

    constructor(page: Page) {
        super(page);
    }

    async openRegistration() {
        const [registrationPage] = await Promise.all([
            this.page.waitForEvent("popup"),
            this.page.getByRole("link", { name: /^Jelentkezem/ }).click(),
        ]);
        this.registrationPage = registrationPage;
        await registrationPage.waitForURL(/karrier\.mindspire\.hu\/DataCenter\/Registration\/Register\//);

        const acceptSelectedCookies = registrationPage.locator(
            '[data-e2e-testing="CookieBox.AcceptSelectedCookiesButton"]:visible',
        );
        await acceptSelectedCookies.first().waitFor({ state: "visible", timeout: 10000 });
        await acceptSelectedCookies.first().click();
    }

    getRegistrationPage(): Page {
        if (!this.registrationPage) {
            throw new Error("Open the registration page before accessing its fields.");
        }
        return this.registrationPage;
    }

    getFamilyNameInput(): Locator {
        return this.getRegistrationPage().getByRole("textbox", { name: /^Vezetéknév/ });
    }

    getGivenNameInput(): Locator {
        return this.getRegistrationPage().getByRole("textbox", { name: /^Keresztnév/ });
    }

    getEmailInput(): Locator {
        return this.getRegistrationPage().getByRole("textbox", { name: /^E-mail cím(?! megerősítése)/ });
    }

    getEmailConfirmationInput(): Locator {
        return this.getRegistrationPage().getByRole("textbox", { name: /^E-mail cím megerősítése/ });
    }

    getPhoneInput(): Locator {
        return this.getRegistrationPage().getByRole("textbox", { name: /^Telefonszám/ });
    }

    async preventRegistrationWrites() {
        await this.getRegistrationPage().route("**/*", async route => {
            const request = route.request();
            const requestUrl = new URL(request.url());
            if (requestUrl.hostname === "karrier.mindspire.hu" && !["GET", "HEAD", "OPTIONS"].includes(request.method())) {
                await route.abort();
                return;
            }
            await route.continue();
        });
    }

    async submitRegistration() {
        await this.getRegistrationPage().getByRole("button", {
            name: "Megismertem a tájékoztatót és jelentkezem",
        }).click();
    }

    async leaveRegistrationWithoutSubmitting() {
        // The live registration page has no Cancel button, so close its popup without saving.
        await this.getRegistrationPage().close();
    }
}
