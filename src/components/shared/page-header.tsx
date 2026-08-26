import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  backHref?: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, backHref, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center', backHref ? 'space-x-4' : 'justify-between', className)}>
      {backHref && (
        <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white hover:bg-gray-800">
          <Link href={backHref}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      )}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-gray-400">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
