import { Page } from '@playwright/test';
import { TopMenuPage } from './pages/topMenu-page';
import { MindspireLandingPage } from './pages/landingPage-page';


export class PageManager {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public get topMenuPage() {
        return new TopMenuPage(this.page);
    }

    public get mindspireLandingPage() {
        return new MindspireLandingPage(this.page);
    }

}