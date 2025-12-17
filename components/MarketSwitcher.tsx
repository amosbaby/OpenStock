'use client';

import { Globe, Check, Languages } from "lucide-react";
import { useMarket } from "@/context/MarketContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MarketSwitcher() {
    const { market, setMarket } = useMarket();
    const { language, setLanguage, t } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Switch Market & Language">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Switch Market & Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('nav.market')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setMarket('US')}>
                    <span className="flex items-center gap-2 flex-1">
                         {t('marketSwitcher.us')}
                    </span>
                    {market === 'US' && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMarket('CN')}>
                    <span className="flex items-center gap-2 flex-1">
                        {t('marketSwitcher.cn')}
                    </span>
                    {market === 'CN' && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Language / 语言</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                    <span className="flex items-center gap-2 flex-1">
                        English
                    </span>
                    {language === 'en' && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('zh')}>
                    <span className="flex items-center gap-2 flex-1">
                        中文 (简体)
                    </span>
                    {language === 'zh' && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
