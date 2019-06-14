/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MoneyUserComponentsPage, MoneyUserDeleteDialog, MoneyUserUpdatePage } from './money-user.page-object';

const expect = chai.expect;

describe('MoneyUser e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let moneyUserUpdatePage: MoneyUserUpdatePage;
  let moneyUserComponentsPage: MoneyUserComponentsPage;
  let moneyUserDeleteDialog: MoneyUserDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load MoneyUsers', async () => {
    await navBarPage.goToEntity('money-user');
    moneyUserComponentsPage = new MoneyUserComponentsPage();
    await browser.wait(ec.visibilityOf(moneyUserComponentsPage.title), 5000);
    expect(await moneyUserComponentsPage.getTitle()).to.eq('jhipsterMoneyApp.moneyUser.home.title');
  });

  it('should load create MoneyUser page', async () => {
    await moneyUserComponentsPage.clickOnCreateButton();
    moneyUserUpdatePage = new MoneyUserUpdatePage();
    expect(await moneyUserUpdatePage.getPageTitle()).to.eq('jhipsterMoneyApp.moneyUser.home.createOrEditLabel');
    await moneyUserUpdatePage.cancel();
  });

  it('should create and save MoneyUsers', async () => {
    const nbButtonsBeforeCreate = await moneyUserComponentsPage.countDeleteButtons();

    await moneyUserComponentsPage.clickOnCreateButton();
    await promise.all([moneyUserUpdatePage.ownerSelectLastOption()]);
    await moneyUserUpdatePage.save();
    expect(await moneyUserUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await moneyUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last MoneyUser', async () => {
    const nbButtonsBeforeDelete = await moneyUserComponentsPage.countDeleteButtons();
    await moneyUserComponentsPage.clickOnLastDeleteButton();

    moneyUserDeleteDialog = new MoneyUserDeleteDialog();
    expect(await moneyUserDeleteDialog.getDialogTitle()).to.eq('jhipsterMoneyApp.moneyUser.delete.question');
    await moneyUserDeleteDialog.clickOnConfirmButton();

    expect(await moneyUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
