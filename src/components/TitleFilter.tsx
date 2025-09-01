import { useMemo } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CSVRow } from '@/types/csv';

interface TitleFilterProps {
  data: CSVRow[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const TitleFilter = ({ data, value, onChange }: TitleFilterProps) => {
  const uniqueTitles = useMemo(() => {
    const titles = [...new Set(data.map(row => row.Title))].filter(Boolean).sort();
    return titles;
  }, [data]);

  if (uniqueTitles.length === 0) {
    return null;
  }

  const handleTitleToggle = (title: string) => {
    if (value.includes(title)) {
      onChange(value.filter(t => t !== title));
    } else {
      onChange([...value, title]);
    }
  };

  const handleSelectAll = () => {
    if (value.length === uniqueTitles.length) {
      onChange([]);
    } else {
      onChange(uniqueTitles);
    }
  };

  const getDisplayText = () => {
    if (value.length === 0) return "All Titles";
    if (value.length === 1) return value[0];
    return `${value.length} titles selected`;
  };

  const filteredCount = value.length === 0 ? data.length : 
    data.filter(row => value.includes(row.Title)).length;

  return (
    <div className="flex items-center space-x-2">
      <Filter className="w-4 h-4 text-muted-foreground" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-64 justify-between">
            <span className="truncate">{getDisplayText()} ({filteredCount})</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all"
                checked={value.length === uniqueTitles.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select All
              </label>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {uniqueTitles.map((title) => {
              const count = data.filter(row => row.Title === title).length;
              return (
                <div key={title} className="flex items-center space-x-2 p-3 hover:bg-muted">
                  <Checkbox
                    id={title}
                    checked={value.includes(title)}
                    onCheckedChange={() => handleTitleToggle(title)}
                  />
                  <label htmlFor={title} className="text-sm cursor-pointer flex-1">
                    {title} ({count})
                  </label>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};