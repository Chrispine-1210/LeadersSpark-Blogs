import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, Type, List, ListOrdered, Link as LinkIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const FONT_FAMILIES = [
  "Inter",
  "Georgia",
  "Merriweather",
  "Playfair Display",
  "Lora",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Montserrat",
];

const TEXT_COLORS = [
  "#000000", "#374151", "#6B7280", "#DC2626", "#EA580C", 
  "#D97706", "#65A30D", "#059669", "#0891B2", "#2563EB", 
  "#7C3AED", "#C026D3",
];

const HIGHLIGHT_COLORS = [
  "transparent", "#FEF3C7", "#DBEAFE", "#D1FAE5", "#FED7AA", 
  "#F3E8FF", "#FCE7F3", "#E0E7FF",
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  highlightColor?: string;
  onFontFamilyChange?: (font: string) => void;
  onFontSizeChange?: (size: string) => void;
  onTextColorChange?: (color: string) => void;
  onHighlightColorChange?: (color: string) => void;
}

export function RichTextEditor({
  content,
  onChange,
  fontFamily = "Inter",
  fontSize = "16px",
  textColor,
  highlightColor,
  onFontFamilyChange,
  onFontSizeChange,
  onTextColorChange,
  onHighlightColorChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSizeValue, setFontSizeValue] = useState(parseInt(fontSize) || 16);
  const [textAlign, setTextAlign] = useState("left");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFontSizeChange = (value: number[]) => {
    const size = value[0];
    setFontSizeValue(size);
    onFontSizeChange?.(`${size}px`);
  };

  const handleTextAlign = (align: string) => {
    setTextAlign(align);
    if (align === "left") execCommand("justifyLeft");
    else if (align === "center") execCommand("justifyCenter");
    else if (align === "right") execCommand("justifyRight");
    else if (align === "justify") execCommand("justifyFull");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="border border-border rounded-lg p-3 bg-card space-y-4">
        {/* First Row: Font and Size */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">Font:</Label>
            <Select value={fontFamily} onValueChange={onFontFamilyChange}>
              <SelectTrigger className="w-40" data-testid="select-font-family">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Label className="text-sm whitespace-nowrap">Size:</Label>
            <Slider
              value={[fontSizeValue]}
              onValueChange={handleFontSizeChange}
              min={12}
              max={72}
              step={1}
              className="flex-1"
              data-testid="slider-font-size"
            />
            <span className="text-sm font-medium w-12 text-right">{fontSizeValue}px</span>
          </div>
        </div>

        {/* Second Row: Text Formatting */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => execCommand("bold")}
              data-testid="button-bold"
              className="h-9 w-9"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => execCommand("italic")}
              data-testid="button-italic"
              className="h-9 w-9"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => execCommand("underline")}
              data-testid="button-underline"
              className="h-9 w-9"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => execCommand("insertUnorderedList")}
              data-testid="button-list-bullet"
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => execCommand("insertOrderedList")}
              data-testid="button-list-ordered"
              className="h-9 w-9"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                const url = prompt("Enter the link URL:");
                if (url) execCommand("createLink", url);
              }}
              data-testid="button-link"
              className="h-9 w-9"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant={textAlign === "left" ? "secondary" : "outline"}
              size="icon"
              onClick={() => handleTextAlign("left")}
              data-testid="button-align-left"
              className="h-9 w-9"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={textAlign === "center" ? "secondary" : "outline"}
              size="icon"
              onClick={() => handleTextAlign("center")}
              data-testid="button-align-center"
              className="h-9 w-9"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={textAlign === "right" ? "secondary" : "outline"}
              size="icon"
              onClick={() => handleTextAlign("right")}
              data-testid="button-align-right"
              className="h-9 w-9"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={textAlign === "justify" ? "secondary" : "outline"}
              size="icon"
              onClick={() => handleTextAlign("justify")}
              data-testid="button-align-justify"
              className="h-9 w-9"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Text Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="h-9 w-9" data-testid="button-text-color">
                <Type className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Text Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="h-8 w-8 rounded border-2 border-border hover-elevate"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        execCommand("foreColor", color);
                        onTextColorChange?.(color);
                      }}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Highlight Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="h-9 w-9" data-testid="button-highlight">
                <Highlighter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Highlight Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {HIGHLIGHT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="h-8 w-8 rounded border-2 border-border hover-elevate"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        execCommand("hiliteColor", color);
                        onHighlightColorChange?.(color);
                      }}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[400px] p-6 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        style={{
          fontFamily: fontFamily,
          fontSize: `${fontSizeValue}px`,
          color: textColor,
        }}
        data-placeholder="Start writing your blog post..."
        data-testid="editor-content"
      />
    </div>
  );
}
