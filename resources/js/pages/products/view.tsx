import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card'; // optional: if you use a card component

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Details',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface PageProps {
    product: Product;
}

export default function View({ product }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product: ${product.name}`} />

            <div className="max-w-4xl mx-auto p-4 space-y-6">
                <h1 className="text-2xl font-bold">Product Details</h1>

                <Card>
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                    />
                </Card>

                <div className="space-y-4">
                    <div className="flex">
                        <span className="font-semibold w-32">ID:</span>
                        <span>{product.id}</span>
                    </div>

                    <div className="flex">
                        <span className="font-semibold w-32">Name:</span>
                        <span>{product.name}</span>
                    </div>

                    <div className="flex">
                        <span className="font-semibold w-32">Price:</span>
                        <span>${product.price}</span>
                    </div>

                    <div className="flex">
                        <span className="font-semibold w-32">Description:</span>
                        <span>{product.description}</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
