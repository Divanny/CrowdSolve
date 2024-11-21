import { Badge } from '@/components/ui/badge';

const ChallengeDetail = ({ desafio, htmlContent, getCategoryName }) => {
    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <img
                    src={desafio.logoEmpresa}
                    alt={`Logo de ${desafio.empresa}`}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                        {desafio.titulo}
                    </h1>
                    <p className="text-base sm:text-lg text-primary">{desafio.empresa}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {desafio.categorias.map((categoria) => (
                    <Badge key={categoria.idDesafioCategoria} variant="outline" className="bg-secondary/10">
                        {getCategoryName(categoria.idCategoria)}
                    </Badge>
                ))}
            </div>
            <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} className='text-foreground' />
            </div>
        </>
    );
};

export default ChallengeDetail;