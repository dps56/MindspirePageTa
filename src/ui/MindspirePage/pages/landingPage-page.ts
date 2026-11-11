import { BasePage } from "../../common/base-page";
import { Page, Locator } from '@playwright/test';

export class MindspireLandingPage extends BasePage {

    private readonly baseMindspireUrl: string = "https://mindspire.hu/";

    private readonly msLogoRule: string = "//a/img[@alt='Mindspire Consulting' and @id='logo']";

    constructor(page: Page) {
        super(page);
        page.setDefaultTimeout(5000);
    }

    async openMindspire() {
        await this.page.goto(this.baseMindspireUrl);
    }
    
    getMsLogo(): Locator {
        return this.page.locator(this.msLogoRule);
    }
    

}