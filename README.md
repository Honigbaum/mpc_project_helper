# MPC Project Helper #
The MPC Project Helper is a Chrome extension that allows you to easily reuse and share your MPC projects. Save time by uploading images in bulk; the extension will automatically pair fronts and backs based on the filenames. MPC Project Helper then creates a json-formatted project file with links to the already uploaded images. This allows you to quickly combine multiple projects for cheaper printing and to share the project file with others, saving them the time of re-uploading and keeping your original project intact. No longer will you have to re-upload a project to make changes, or find that someone with whom you shared a link to your design inadvertently changed the project for everyone.


## Installing the Extension ##
1. Download this project by clicking the green **Code** button and selecting **Download ZIP**.
2. Unzip the file.
3. In Chrome, click the three vertical dots at the right end of the toolbar and choose **Settings** from the menu. [View screenshots for steps 3–6.](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)
4. Choose **Extensions** in the left sidebar.
5. Enable the **Developer Mode** slider in the top right.
6. Click the **Load Unpacked** and browse to the `dist` folder inside the MPC Project Helper directory you downloaded.
7. The extension should now be installed. If you don&rsquo;t see the snowflake icon on the right side of your toolbar, click the puzzle piece icon to list your Chrome extensions and select the **Pin** icon next to MPC Project Helper to make the icon visible.
8. MPC Project Helper is now installed. 
9. Go to [makeplayingcards.com](https://www.makeplayingcards.com/) in Chrome and log in to your account.
10. Click the snowflake icon to bring up the MPC Project Helper.


## Uploading Images ##
If you have an MPC Project Helper `project.txt` file that you or someone else already created, then you can skip to step 20 under **Loading the Project**. Otherwise:

11. Prepare your images for upload by having individual files with the front and back of each card. Prefixing each file name with the card number will ensure your cards are loaded in order, and suffixing all card fronts with `-1` and backs with `-2`, will allow the project helper to automatically pair the front and back of each card, assuming the file name is otherwise identical. Your file names should now look like this:
   ```
   001 First card name-1.png
   001 First card name-2.png
   002 Second card name-1.png
   002 Second card name-2.png
   ```
12. Click the **Images** tab on the right and then **Select** on the left.
13. Browse to the folder containing your images, use Command-A or Ctrl-A to select them all, and click **Open**.
14. Review the list to confirm that card fronts and backs are paired up as desired.
15. Click **Upload**. This may take a while for larger projects.
16. When you see the **Upload Success** message, click **Save**.
17. You should see that a file named `project.txt` has been downloaded to your hard drive. Click **Close**. 
18. If you do not see the downloaded file in the bottom of your browser window, go back to your Chrome Settings (the three dots in the upper right) and in the left sidebar, click **Advanced**, then **Downloads**, and turn off **Ask where to save each file**. Repeat steps 15&ndash;17.
19. You may rename the `project.txt` file if desired (as long as you retain the `.txt` extension) and relocate it as you choose. Now you&rsquo;re ready to create your MPC Project.

## Loading the Project ##
20. Click the **Project** tab and then the **Select** button.
21. Browse to the location of your `project.txt` file, select it, and click **Open**.
22. You may select additional files to combine multiple projects into one. Use the draggable handles on the right to reorder projects as desired.
23. Click **Upload**.
24. When you see the **Upload Success** message, click **Open**. It may take a minute for the page to load so don&rsquo;t panic if all you see is a white screen, but this step will take substantially less time than the uploading step for images.
25. This will take you to Step 5 of MPC&rsquo;s project design, eliminating the first four tedious steps. 
26. If you want to give your project a meaningful name instead of a randomly generated one (this is useful for identifying it in your cart and later in your order history), click **Previous**, change the project name in the upper left from `Project-randomstringofcharacters` to something meaningful, and click the **Save** button next to it (even though it appears disabled, it is actually a clickable button.) Then click **Next Step** to return to step 5.
27. Check the disclaimer box and **Add to Cart**. :tada: