import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  iconClassName?: string;
  titleClassName?: string;
  footer?: React.ReactNode;
}

export function StatCard({ title, value, icon: Icon, iconClassName, titleClassName, footer }: StatCardProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn('text-sm font-medium', titleClassName)}>{title}</CardTitle>
        {Icon && <Icon className={cn('h-4 w-4', iconClassName)} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {footer}
      </CardContent>
    </Card>
  );
}
