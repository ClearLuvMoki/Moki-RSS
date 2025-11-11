import Channels from "@/src/domains/channel";
import type { FeedType } from "@/src/domains/types/feed";
import type { RSSType } from "@/src/domains/types/rss";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useDebounceFn } from "ahooks";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Inject from "../../inject";
import { useGlobalStore } from "../../store";

const Search = () => {
  const { t } = useTranslation();
  const { updateActiveFeed, updateRSSDetail } = useGlobalStore();
  const [list, setList] = useState<RSSType[]>([]);
  const [loading, setLoading] = useState(false);

  const { run: search } = useDebounceFn(
    (value: string) => {
      onSearch(value);
    },
    {
      wait: 800,
    },
  );

  const onSearch = useCallback((value: string) => {
    setLoading(true);
    setList([]);
    Inject.invoke<{ keyword: string }, RSSType[]>(Channels.SearchRSS, {
      keyword: value,
    })
      .then((list) => {
        setList(list);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      });
  }, []);

  const onClickItem = useCallback(
    (item: RSSType) => {
      const feedId = item?.feedId;
      Inject.invoke<{ feedId: string }, FeedType>(Channels.SearchFeed, {
        feedId,
      }).then((feed) => {
        console.log(feed, "feed");
        updateActiveFeed(feed);
      });
      updateRSSDetail(item);
    },
    [updateActiveFeed, updateRSSDetail],
  );

  return (
    <Autocomplete
      className="max-w-xs"
      size="sm"
      items={list}
      isLoading={loading}
      placeholder={t("search.placeholder")}
      onValueChange={(value) => {
        if (!value || loading) return;
        search(value);
      }}
    >
      {(item) => {
        return (
          <AutocompleteItem key={item?.id} onPress={() => onClickItem(item)}>
            <div className="flex-col">
              <h4 className="line-clamp-1">{item?.title}</h4>
              <div className="line-clamp-2">{item?.contentSnippet}</div>
            </div>
          </AutocompleteItem>
        );
      }}
    </Autocomplete>
  );
};

export default Search;
