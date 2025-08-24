from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify Home page
    page.goto("http://localhost:5173/")
    page.screenshot(path="jules-scratch/verification/home-page.png")

    # Verify About page
    page.goto("http://localhost:5173/about")
    page.screenshot(path="jules-scratch/verification/about-page.png")

    # Verify Trainings page
    page.goto("http://localhost:5173/trainings")
    page.screenshot(path="jules-scratch/verification/trainings-page.png")

    # Verify Contact page
    page.goto("http://localhost:5173/contact")
    page.screenshot(path="jules-scratch/verification/contact-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
