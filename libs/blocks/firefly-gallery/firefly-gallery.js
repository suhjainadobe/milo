import { createTag, getConfig } from '../../utils/utils.js';

const FIREFLY_API_URL = 'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const API_PARAMS = '?size=16&sort=updated_desc&include_pending_assets=false&category_id=text2Image&cursor=';
const API_PARAMS_VIDEO = '?page_size=20&sort=updated_desc&include_pending_assets=false&category_id=VideoGeneration&cursor=';
const API_KEY = 'alfred-community-hubs';

async function fetchFireflyImages() {
  try {
    console.log('Fetching Firefly images...');
    const response = await fetch(`${FIREFLY_API_URL}${API_PARAMS}`, {
      headers: { 'x-api-key': API_KEY },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Firefly API response:', data);
    return data._embedded?.assets || [];
  } catch (error) {
    console.error('Error fetching Firefly images:', error);
    return [];
  }
}

async function fetchFireflyVideos() {
  try {
    console.log('Fetching Firefly Video...');
    const response = await fetch(`${FIREFLY_API_URL}${API_PARAMS_VIDEO}`, {
      headers: { 'x-api-key': API_KEY },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Firefly API response for Video:', data);
    return data._embedded?.assets || [];
  } catch (error) {
    console.error('Error fetching Firefly Video:', error);
    return [];
  }
}
const replaceRenditionUrl = (url, format, dimension, size) => url
  .replace(/{format}/g, format)
  .replace(/{dimension}/g, dimension)
  .replace(/{size}/g, size);

function getImageRendition(asset) {
  if (!asset) return '';

  // Check if rendition_url exists
  const renditionUrl = replaceRenditionUrl(
    asset._links?.rendition?.href,
    'jpg',
    'width',
    350,
  );
  return renditionUrl;
}

function createGalleryStructure() {
  const galleryContainer = createTag('div', {
    class: 'firefly-gallery-container',
  });
  const galleryHeader = createTag('div', { class: 'firefly-gallery-header' });
  const galleryTitle = createTag(
    'h2',
    { class: 'firefly-gallery-title heading-xl' },
    'Firefly Gallery',
  );
  const galleryContent = createTag('div', { class: 'firefly-gallery-content' });

  galleryHeader.appendChild(galleryTitle);
  galleryContainer.appendChild(galleryHeader);
  galleryContainer.appendChild(galleryContent);

  return {
    container: galleryContainer,
    content: galleryContent,
  };
}

// Masonry layout configuration
const MASONRY_CONFIG = {
  minColumns: 2,
  maxColumns: 6,
  optimumWidth: 250,
  gap: 16,
  minWidth: 150,
  hasMultiColumnElement: false,
};

// Get aspect ratio for different asset types
function getAssetAspectRatio(asset) {
  // Default aspect ratios for different asset types
  if (asset && asset.type === 'video') {
    return 16 / 9; // Standard video aspect ratio
  }
  return 1; // Default square aspect ratio for images
}

// Find the shortest column for masonry placement
function getShortestColumn(columnHeights) {
  let shortest = 0;
  for (let i = 1; i < columnHeights.length; i += 1) {
    if (columnHeights[i] < columnHeights[shortest]) {
      shortest = i;
    }
  }
  return shortest;
}

// Calculate masonry layout positions
function calculateMasonryLayout(assets, containerWidth) {
  const { minColumns, maxColumns, optimumWidth, gap } = MASONRY_CONFIG;
  // Calculate column count based on container width
  let columnCount = Math.max(minColumns, Math.round(containerWidth / optimumWidth));
  if (maxColumns) {
    columnCount = Math.min(columnCount, maxColumns);
  }

  // Initialize column heights
  const columnHeights = new Array(columnCount).fill(0);
  const itemPositions = [];

  // Calculate item width after accounting for gaps
  const itemWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;
  const scale = itemWidth / optimumWidth;

  // Place each asset in the masonry layout
  assets.forEach((asset) => {
    const columnIndex = getShortestColumn(columnHeights);

    const x = columnIndex * (itemWidth + gap);
    const y = columnHeights[columnIndex] * scale;

    const aspectRatio = getAssetAspectRatio(asset);
    const baseHeight = optimumWidth / aspectRatio;
    const itemHeight = baseHeight * scale;

    // All items use single column width
    itemPositions.push({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(itemWidth),
      height: Math.round(itemHeight),
      isMultiColumn: false,
    });

    columnHeights[columnIndex] += baseHeight + gap;
  });

  return itemPositions;
}

function createDynamicMasonryLayout(container, assets) {
  // Create the masonry grid container
  const masonryGrid = createTag('div', {
    class: 'firefly-gallery-masonry-grid loading',
  });

  // Get container width for layout calculation
    const containerWidth = container.clientWidth || 1200; // Fallback width
  // Calculate positions for all assets
  const positions = calculateMasonryLayout(assets, containerWidth);
  const skeletonItems = [];

  // Create skeleton items based on calculated positions
  positions.forEach((position) => {
    const itemClass = 'firefly-gallery-item skeleton-item';
    const skeletonItem = createTag('div', { 
      class: itemClass,
      style: `position: absolute; left: ${position.x}px; top: ${position.y}px; width: ${position.width}px; height: ${position.height}px;`,
    });

    // Add a wrapper for the skeleton animation
    const skeletonWrapper = createTag('div', { class: 'skeleton-wrapper' });

    // Add loading animation elements
    const skeletonAnimation = createTag('div', { class: 'skeleton-animation' });

    skeletonWrapper.appendChild(skeletonAnimation);
    skeletonItem.appendChild(skeletonWrapper);
    masonryGrid.appendChild(skeletonItem);

    skeletonItems.push(skeletonItem);
  });

  // Set the grid height based on the tallest column
  const maxHeight = Math.max(...positions.map(p => p.y + p.height));
  masonryGrid.style.height = `${maxHeight}px`;
  masonryGrid.style.position = 'relative';

  container.appendChild(masonryGrid);
  return { masonryGrid, skeletonItems };
}

function loadImageIntoSkeleton(
  skeletonItem,
  imageUrl,
  altText,
  promptText,
  userInfo = {},
  assetData = {},
) {
  return new Promise((resolve) => {
    console.log(`Loading ${assetData.type || 'image'}:`, imageUrl);

    const img = createTag('img', {
      src: imageUrl,
      alt: altText,
      loading: 'lazy',
    });

    const mediaContainer = createTag('div', {
      class: 'firefly-gallery-image',
    });

    // Add asset type to container for styling
    if (assetData.type === 'video') {
      mediaContainer.classList.add('firefly-gallery-video-item');
      skeletonItem.classList.add('video-item');
    }

    mediaContainer.appendChild(img);

    // Add video element for video assets (hidden initially)
    if (assetData.type === 'video' && assetData.videoUrl) {
      const video = createTag('video', {
        src: assetData.videoUrl,
        class: 'firefly-gallery-video',
        muted: true,
        loop: true,
        preload: 'none',
      });

      video.addEventListener('loadeddata', () => {
        console.log('Video loaded:', assetData.videoUrl);
      });

      video.addEventListener('error', (e) => {
        console.error('Video loading error:', e);
      });

      mediaContainer.appendChild(video);

      // Add play icon indicator with white SVG
      const playIcon = createTag('div', {
        class: 'firefly-gallery-play-icon',
      });
      
      // Use inline white SVG for better reliability
      playIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
      
      mediaContainer.appendChild(playIcon);

      // Add hover event listeners for video playback (hover-only behavior)
      let hoverTimeout;

      mediaContainer.addEventListener('mouseenter', () => {
        // Clear any existing timeout
        clearTimeout(hoverTimeout);
        
        // Start video immediately on hover
        img.style.opacity = '0';
        playIcon.style.opacity = '0';
        video.style.opacity = '1';
        video.currentTime = 0;
        video.play().catch((err) => {
          console.warn('Video play failed:', err);
        });
      });

      mediaContainer.addEventListener('mouseleave', () => {
        // Stop video immediately when hover ends
        clearTimeout(hoverTimeout);
        video.pause();
        video.currentTime = 0;
        img.style.opacity = '1';
        playIcon.style.opacity = '1';
        video.style.opacity = '0';
      });
    }

    // Add prompt overlay
    if (promptText) {
      const overlay = createTag('div', {
        class: 'firefly-gallery-overlay',
      });

      // Add user info container at the top left
      if (userInfo.name || userInfo.avatarUrl) {
        const userInfoContainer = createTag('div', {
          class: 'firefly-gallery-user-info',
        });

        // Add user avatar if available
        if (userInfo.avatarUrl) {
          const avatar = createTag('img', {
            src: userInfo.avatarUrl,
            alt: `${userInfo.name || 'Artist'}'s avatar`,
            class: 'firefly-gallery-user-avatar',
          });
          userInfoContainer.appendChild(avatar);
        }

        // Add username if available
        if (userInfo.name) {
          const username = createTag(
            'span',
            {
              class: 'firefly-gallery-username',
            },
            userInfo.name,
          );
          userInfoContainer.appendChild(username);
        }

        overlay.appendChild(userInfoContainer);
      }

      const promptElement = createTag(
        'div',
        {
          class: 'firefly-gallery-prompt',
        },
        promptText,
      );

      overlay.appendChild(promptElement);
      mediaContainer.appendChild(overlay);
    }

    // Handle image load event
    console.log(`${assetData.type || 'Image'} loaded successfully:`, imageUrl);

    // Add loaded class to trigger transition
    skeletonItem.classList.add('loaded');

    // Replace skeleton wrapper with actual media after animation
    const skeletonWrapper = skeletonItem.querySelector('.skeleton-wrapper');
    if (skeletonWrapper) {
      skeletonItem.replaceChild(mediaContainer, skeletonWrapper);
    } else {
      // Fallback if wrapper not found
      skeletonItem.innerHTML = '';
      skeletonItem.appendChild(mediaContainer);
    }

    resolve();
  });
}

function constructVideoUrl(assetId) {
  return `https://cdn.cp.adobe.io/content/2/dcx/${assetId}/content/manifest/version/0/component/path/output/resource`;
}

async function fetchMixedAssets() {
  try {
        console.log('Fetching mixed Firefly assets...');
    // Fetch both images and videos concurrently
    const [imageAssets, videoAssets] = await Promise.all([
      fetchFireflyImages(),
      fetchFireflyVideos(),
    ]);

    // Mark assets with their type
    const markedImages = imageAssets.map((asset) => ({ ...asset, type: 'image' }));
    const markedVideos = videoAssets.map((asset) => ({ ...asset, type: 'video' }));

    // Combine and shuffle the arrays for a mixed layout
    const combinedAssets = [...markedImages, ...markedVideos];

    for (let i = combinedAssets.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedAssets[i], combinedAssets[j]] = [combinedAssets[j], combinedAssets[i]];
    }

    console.log(`Fetched ${imageAssets.length} images and ${videoAssets.length} videos, mixed into ${combinedAssets.length} total assets`);
    return combinedAssets;
  } catch (error) {
    console.error('Error fetching mixed assets:', error);
    return [];
  }
}

async function loadFireflyImagesWithDynamicLayout(container) {
  try {
    // Fetch mixed assets from Firefly API
    const assets = await fetchMixedAssets();

    if (!assets || !assets.length) {
      console.warn('No assets returned from Firefly API');
      return;
    }

    console.log(`Creating dynamic layout for ${assets.length} Firefly assets`);

    // Create dynamic masonry layout based on assets
    const { masonryGrid, skeletonItems } = createDynamicMasonryLayout(container, assets);

    // Get current locale or fallback to default
    const locale = getConfig().locale?.ietf || 'en-US';

    // Load assets into skeleton items
    const loadPromises = skeletonItems.map((item, index) => {
      if (index >= assets.length) return Promise.resolve();

      const asset = assets[index];
      const imageUrl = getImageRendition(asset);
      const altText = asset.title || `Firefly generated ${asset.type}`;

      // Get localized prompt text
      let promptText = '';
      if (asset?.custom?.input?.['firefly#prompts']) {
        // Try to get prompt for current locale
        promptText = asset.custom.input['firefly#prompts'][locale]
          || asset.custom.input['firefly#prompts']['en-US'] // Fallback to English
          || Object.values(asset.custom.input['firefly#prompts'])[0] // Fallback to any available locale
          || asset.title // Final fallback
          || `Firefly generated ${asset.type}`;
      } else {
        // Use title as fallback
        promptText = asset.title || `Firefly generated ${asset.type}`;
      }

      // Get user info
      const userInfo = {};
      if (asset?._embedded?.owner) {
        const { _embedded: { owner } } = asset;
        userInfo.name = owner.display_name
          || `${owner.first_name} ${owner.last_name}`.trim()
          || owner.user_name
          || 'Unknown Artist';

        // Get the user avatar image - find the one closest to 24px
        if (owner._links?.images && owner._links?.images?.length > 0) {
          // We want an image that's at least 24px but not too much larger
          // First sort by size to find closest match to our target 24px size
          const sortedImages = [...owner._links.images].sort((a, b) => {
            const aDiff = Math.abs(a.width - 24);
            const bDiff = Math.abs(b.width - 24);
            return aDiff - bDiff; // Sort by closest to 24px
          });

          userInfo.avatarUrl = sortedImages[0].href; // Use the closest to 24px
        }
      }

      // Prepare asset data for video handling
      const assetData = {
        type: asset.type,
        videoUrl: asset.type === 'video' ? constructVideoUrl(asset.id) : null,
        fireflyUrl: asset.type === 'video'
          ? `https://firefly.adobe.com/open?assetOrigin=community&assetType=VideoGeneration&id=${asset.id}`
          : null,
      };

      console.log(`Loading ${asset.type} ${index + 1}/${assets.length}: ${imageUrl}`);
      return loadImageIntoSkeleton(
        item,
        imageUrl,
        altText,
        promptText,
        userInfo,
        assetData,
      );
    });

    await Promise.all(loadPromises);
    console.log('All images loaded successfully');

    // Remove loading state
    masonryGrid.classList.remove('loading');
  } catch (error) {
    console.error('Error loading Firefly images:', error);
  }
}

export default async function init(el) {
  el.classList.add('firefly-gallery-block', 'con-block');

  // Clear existing content
  el.textContent = '';

  // Create gallery structure
  const { container, content } = createGalleryStructure();

  // Replace block content with our gallery structure
  el.appendChild(container);

  // Add additional classes for styling
  el.classList.add('max-width-10-desktop');

  // Load Firefly images with dynamic masonry layout
  loadFireflyImagesWithDynamicLayout(content);
}
