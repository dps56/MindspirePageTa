import { BasePage } from "../../common/base-page";
import { Locator, Page } from '@playwright/test';

export class TopMenuPage extends BasePage {

    private readonly topMenu: Locator;

    constructor(page: Page) {
        super(page);
        this.topMenu = this.page.locator("#top-menu-nav");
    }

    async openNavElement(menuName: string) {
        if (menuName === "Hírek") {
            await this.topMenu.getByRole("link", { name: /^MÉDIA/ }).hover();
        }

        await this.topMenu.getByRole("link", { name: menuName, exact: true }).click();
    }
}