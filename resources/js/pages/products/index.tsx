import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

import {
    Table,
    TableBody,
    TableCell,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    products: {
        data: Product[];
        links: PaginationLink[];
    };
    filters: {
        search?: string;
    };
    flash: {
        message?: string;
    };
}

export default function Index() {
    const { products, filters, flash } = usePage<PageProps>().props;

    const handleSearch = (e: React.ChangeEvent) => {
        router.get(
            '/products',
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {/* Header */}
            <div className="m-4 flex items-center justify-between">
                <Input
                    placeholder="Search products..."
                    defaultValue={filters.search}
                    onChange={handleSearch}
                    className="max-w-sm"
                />

                <Link href="/products/create">
                    <Button>Create Product</Button>
                </Link>
            </div>

            {/* Flash Message */}
            {flash.message && (
                <div className="m-4 text-green-600">
                    {flash.message}
                </div>
            )}

            {products.data.length > 0 ? (
                <div className="m-4">
                    <Table>
                        <TableCaption>A list of your products</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {products.data.map((product, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        {product.name}
                                    </TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell className="text-center">
                                        <Button size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {products.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-1 rounded border text-sm
                                    ${link.active ? 'bg-black text-white' : 'bg-white'}
                                    ${!link.url && 'opacity-50 cursor-not-allowed'}
                                `}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="m-4 text-muted-foreground">
                    No products found
                </div>
            )}
        </AppLayout>
    );
}
