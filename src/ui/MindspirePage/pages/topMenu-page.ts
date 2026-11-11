import { BasePage } from "../../common/base-page";
import { Page } from '@playwright/test';

export class TopMenuPage extends BasePage {

    private readonly baseTopMenuRule: string = "//nav[@id='top-menu-nav']";

    //private readonly projektNavRule: string = `${this.baseTopMenuRule}//ul/li/a[text()='REFERENCIÁK']`;
    private readonly referenciakRule: string = `//ul/li/a[text()='REFERENCIÁK']`;
    private readonly publikaciokRule: string = `//ul/li/a[text()='PUBLIKÁCIÓK']`;

    private readonly topMenu: any;

    constructor(page: Page) {
        super(page);
        this.topMenu = this.page.frameLocator(this.baseTopMenuRule);
        page.setDefaultTimeout(5000);
    }

    async openNavElement(menuName: string) {
        console.log(`click: ${menuName}`);

        switch (menuName.toUpperCase()) {
            case "REFERENCIÁK":
                await this.topMenu.locator(this.referenciakRule).click();
                break;
            case "PUBLIKÁCIÓK":
                await this.topMenu.locator(this.publikaciokRule).click();
                break;
            default:
                break;
        }
        await this.page.waitForTimeout(500);

    }
    

}