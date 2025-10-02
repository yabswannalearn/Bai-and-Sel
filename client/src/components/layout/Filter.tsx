"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onFilter: (filters: Record<string, any>) => void;
};

export default function ItemFilter({ onFilter }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [itemLocation, setItemLocation] = useState("");

  const handleApply = () => {
    onFilter({
      ...(search && { search }),
      ...(category && { category }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(itemLocation && { itemLocation }),
    });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setItemLocation("");
    onFilter({});
  };

  return (
    <Card className="w-64 p-4 h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search Items"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="itemLocation">Location</Label>
          <Input
            id="itemLocation"
            placeholder="Location"
            value={itemLocation}
            onChange={(e) => setItemLocation(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={handleApply} className="w-full">
            Apply
          </Button>
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
