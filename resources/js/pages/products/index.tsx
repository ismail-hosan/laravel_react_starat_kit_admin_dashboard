import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { SquarePen, Eye, Trash } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Switch } from '@/components/ui/switch';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
];

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface PaginationLinkType {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    products: {
        data: Product[];
        links: PaginationLinkType[];
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
    const { delete: destroy, processing } = useForm();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            '/products',
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(`/products/destroy/${id}`);
        }
    };

    const handleStatusChange = (id: number, checked: boolean) => {
        const confirmed = window.confirm(
            `Are you sure you want to ${checked ? "activate" : "deactivate"} this product?`
        );

        if (!confirmed) return;

        router.put(
            `/products/status/${id}`,
            { status: checked ? "active" : "inactive" },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {/* Header */}
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search products..."
                    defaultValue={filters.search}
                    onChange={handleSearch}
                    className="max-w-sm m-3"
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
                        {/* <TableCaption>A list of your products</TableCaption> */}

                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Picture</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {products.data.map((product, index) => (
                                <TableRow key={product.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        {product.name}
                                    </TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={product.status === "active"}
                                            onCheckedChange={(checked) =>
                                                handleStatusChange(product.id, checked)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="text-center space-x-1">
                                        <Link href={`/products/edit/${product.id}`}>
                                            <Button size="sm">
                                                <SquarePen />
                                            </Button>
                                        </Link>

                                        <Link href={`/products/view/${product.id}`}>
                                            <Button size="sm">
                                                <Eye />
                                            </Button>
                                        </Link>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={processing}
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <Trash />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* ✅ Pagination */}
                    <Pagination className="mt-6">
                        <PaginationContent>
                            {products.links.map((link, index) => {
                                if (link.label.includes('Previous')) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationPrevious
                                                onClick={() => link.url && router.visit(link.url)}
                                                className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                    );
                                }

                                if (link.label.includes('Next')) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationNext
                                                onClick={() => link.url && router.visit(link.url)}
                                                className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                    );
                                }

                                if (link.label === '...') {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            isActive={link.active}
                                            onClick={() => link.url && router.visit(link.url)}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                </div>
            ) : (
                <div className="m-4 text-muted-foreground">
                    No products found
                </div>
            )}
        </AppLayout>
    );
}
