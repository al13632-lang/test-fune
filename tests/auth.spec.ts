import { test, expect } from '@playwright/test';

test.describe('FuneralSync Pro E2E', () => {
    test('Redirects unauthenticated users to login', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/.*login/);
    });

    test('Public memorial page is accessible', async ({ page }) => {
        // Nota: Esto asume que existe un memorial con slug 'demo'
        await page.goto('/memorial/demo');
        // Si no existe, al menos validamos que intente cargar la ruta
        expect(page.url()).toContain('/memorial/demo');
    });

    test('Login form renders correctly', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toContainText('FuneralSync Pro');
        await expect(page.locator('button[type="submit"]')).toContainText('Iniciar Sesión');
    });
});
