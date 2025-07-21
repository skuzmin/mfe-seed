import skeletonStyles from './styles/skeleton.scss?inline';

export const Prerender = () => {
  return `
    <div>
        <style>
          ${skeletonStyles}
        </style>
        <div class="skeleton-container">
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
        </div>
    </div>`;
};
