"use client";
import { useState } from "react";
import Button from "../../components/button";
import TextField from "../../components/textfield";
import useSWR from "swr";
import { Organization } from "@/lib/types/api";
import LoadingIndicator from "@/app/components/loading-indicator";
import Link from "next/link";

function Result(props: { id: string; name: string; description: string }) {
  return (
    <Link href={`/company-profile/${props.id}`}>
      <div className="border-b last:border-b-0 p-4 hover:bg-[rgba(0,0,0,.07)] cursor-pointer">
        <p className="font-medium">{props.name}</p>
        <p className="text-textSecondary max-w-full truncate">
          {props.description}
        </p>
      </div>
    </Link>
  );
}

export default function Search() {
  const [inputState, setInputState] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading } = useSWR<Organization[]>(() =>
    searchTerm ? `/organization/search?phrase=${searchTerm}` : null
  );

  return (
    <div className="w-full mt-8">
      <div className="flex w-full">
        <form
          className="basis-1/3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearchTerm(inputState);
          }}
        >
          <TextField
            name="phrase"
            id="phrase"
            value={inputState}
            onChange={(e) => {
              setInputState(e.target.value);
            }}
            className="grow"
            placeholder="Find companies"
          />
          <Button type="submit">
            {isLoading ? <LoadingIndicator /> : "Search"}
          </Button>
        </form>
      </div>

      {error && (
        <p className="mt-8">
          An error occurred. We could not complete your search!
        </p>
      )}
      {isLoading && <LoadingIndicator className="mt-8" />}
      {!error && !isLoading && !data && (
        <p className="mt-8">
          Type in a search phrase in the text box above to search
        </p>
      )}
      {!error && !isLoading && data && (
        <div className="w-full shadow-sxl mt-8 rounded-lg">
          {data.map((o) => (
            <Result
              key={o.id}
              id={o.id}
              name={o.name}
              description={o.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
