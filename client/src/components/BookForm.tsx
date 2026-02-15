import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Grid } from '@mui/material';
import { BookSchema, BookFormData } from '../schemas';

interface BookFormProps {
  defaultValues?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const BookForm = ({ defaultValues, onSubmit, isLoading, submitLabel = 'Submit' }: BookFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(BookSchema),
    defaultValues: defaultValues || {
        title: '',
        authorName: '',
        isbn: '',
        publisher: '',
        publishedDate: '',
        genre: '',
        price: 0,
        stockCount: 0,
        overview: '',
        posterUrl: ''
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Author"
            {...register('authorName')}
            error={!!errors.authorName}
            helperText={errors.authorName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                label="Genre"
                {...register('genre')}
                error={!!errors.genre}
                helperText={errors.genre?.message}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                label="Price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                error={!!errors.price}
                helperText={errors.price?.message}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                label="Stock"
                type="number"
                {...register('stockCount', { valueAsNumber: true })}
                error={!!errors.stockCount}
                helperText={errors.stockCount?.message}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                fullWidth
                label="Overview"
                multiline
                rows={4}
                {...register('overview')}
                error={!!errors.overview}
                helperText={errors.overview?.message}
            />
        </Grid>
        {/* Add more fields as needed (publisher, etc) */}
        <Grid item xs={12}>
            <TextField
                fullWidth
                label="Poster URL (Optional)"
                {...register('posterUrl')}
                error={!!errors.posterUrl}
                helperText={errors.posterUrl?.message}
            />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {submitLabel}
      </Button>
    </Box>
  );
};

export default BookForm;
