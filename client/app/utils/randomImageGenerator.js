const tagImages = {
  "Organic Farming": [
    "https://kotharigroupindia.com/blog/images/organic-farming.JPG",
    "https://www.viralspices.com/wp-content/uploads/2018/10/Organic-Farming-Future-of-Agriculture.png",
    "https://i.ndtvimg.com/i/2017-02/soil_620x350_81487334083.jpg",
    "https://st.adda247.com/https://www.adda247.com/jobs/wp-content/uploads/sites/22/2024/07/30155057/Organic-Farming-Meaning-Types-Advantages-and-Limitations-01.png",
    "https://www.techsciresearch.com/admin/gall_content/2025/1/2025_1$blog_Challenges%20of%20Organic%20Farming%20Key%20Obstacles%20and%20Solutions.png_30_Jan_2025_184509630.png",
  ],
  "Sustainable Farming": [
    "https://www.green.earth/hs-fs/hubfs/Sustainable%20farming%20practices%20and%20the%20long-term%20survival%20of%20civilisations_visual%201.png?width=2400&height=1600&name=Sustainable%20farming%20practices%20and%20the%20long-term%20survival%20of%20civilisations_visual%201.png",
    "https://sambodhi.co.in/wp-content/uploads/2023/06/Untitled-design-100-1.png",
    "https://nanodap.in/public/admin/blogs/1694155338.jpg",
    "https://eng.ruralvoice.in/uploads/images/2022/06/image_750x_62ba86a6765b4.jpg",
    "https://cdn.wikifarmer.com/images/detailed/2024/06/Untitled-design-24.jpg",
  ],
  "Regenerative Agriculture": [
    "https://images.squarespace-cdn.com/content/v1/580fd28d20099ec7189b72cf/82c7143c-a3a8-4cb3-b11d-b8e06a3ae405/reg+ag.png",
    "https://images.squarespace-cdn.com/content/v1/580fd28d20099ec7189b72cf/82c7143c-a3a8-4cb3-b11d-b8e06a3ae405/reg+ag.png?format=2500w",
  ],
  "Urban Farming": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/New_crops-Chicago_urban_farm.jpg/960px-New_crops-Chicago_urban_farm.jpg",
    "https://www.agritecture.com/hubfs/Imported_Blog_Media/future%20with%20urban%20farming-Sep-11-2023-11-35-20-4420-AM.jpg",
  ],
  "Soil Health": [
    "https://agrotis.in/wp-content/uploads/2023/07/Blog-Image-10-copy.png",
    "https://growers.ag/wp-content/uploads/2021/03/SoilNutrients-1024x680.png",
  ],
  "Precision Farming": [
    "https://getfarms.in/assets/images/blog/precision-farming.webp",
  ],
};

export const getRandomImage = (tags) => {
  if (!tags || tags.length === 0) return null;

  const validTags = tags.filter((tag) => tagImages[tag]);
  if (validTags.length === 0) return null;

  const randomTag = validTags[Math.floor(Math.random() * validTags.length)];
  const images = tagImages[randomTag];
  return images[Math.floor(Math.random() * images.length)];
};
