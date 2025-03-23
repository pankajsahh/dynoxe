export function formatCarouselData(data) {
  if (data?.page?.content?.contentModules) {
    const carousel = data.page.content.contentModules.filter((item) => {
      return item.contentModuleType.slug === "hero-carousel";
    });
    if (carousel && carousel.length) {
      return carousel[0];
    } else {
      return null;
    }
  } else {
    return [];
  }
}

export function formatPageData(data) {
  const content = data?.page?.content || data?.contentCollection;
  if (content?.contentModules) {
    const page = content.contentModules.filter((item) => {
      if (item.contentModuleType.slug === "hero-carousel") {
        return false;
      }
      if (item.items.length === 0) {
        return false;
      }
      return true;
    });
    return page;
  } else {
    return [];
  }
}

export function formatPageDataForSeries(data) {
  const content = data?.contentCollection;
  if (content?.contentModules) {
    const contentModules = content.contentModules.filter((item) => {
      if (item.contentModuleType.slug === "season") {
        // let obj = { ...item };
        // arr.push(obj);
        return item;
      }
    });
    data.contentCollection.contentModules = contentModules;
    return data.contentCollection;
  } else {
    return data.contentCollection;
  }
}

export function formatCollectionsData(data) {
  const arr = [];
  let count = 0;
  let limit = 5;
  if (data && data.contentCollections && data.contentCollections.length > 0) {
    while (count < data.contentCollections.length) {
      const obj = {
        contentModuleType: { imageOrientation: "landscape" },
      };
      obj.items = data.contentCollections.slice(count, count + limit);
      count = count + limit;
      arr.push(obj);
    }
  }
  return arr;
}

export function formatWatchListData(data) {
  const arr = [];
  let count = 0;
  let limit = 5;
  if (data && data.watchlist && data.watchlist.length > 0) {
    while (count < data.watchlist.length) {
      const obj = {
        contentModuleType: { imageOrientation: "landscape" },
      };
      obj.items = data.watchlist.slice(count, count + limit);
      count = count + limit;
      arr.push(obj);
    }
  }
  return arr;
}

export function formatSearchData(data) {
  const arr = [];
  let count = 0;
  let limit = 5;
  if (data && data.searchContent && data.searchContent.length > 0) {
    while (count < data.searchContent.length) {
      const obj = {
        contentModuleType: { imageOrientation: "landscape" },
      };
      obj.items = data.searchContent.slice(count, count + limit);
      count = count + limit;
      arr.push(obj);
    }
  }
  return arr;
}
