import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { ApiResponse } from '../../shared/utils/response.js';
import { dynamicRepository } from './dynamic.repository.js';
import { getPostgresPool } from '../../database/postgresClient.js';

const router = Router();
router.get('/library', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.library(req.query.q || '')); } catch (e) { next(e); } });
router.get('/placements', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.placements()); } catch (e) { next(e); } });
router.get('/faq', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.faqs()); } catch (e) { next(e); } });
router.post('/faq', authMiddleware, async (req, res, next) => { try { const result = await getPostgresPool().query('INSERT INTO faq_entries (category, question, answer) VALUES ($1, $2, $3) RETURNING *', [req.body.category || 'General', req.body.question, req.body.answer]); return ApiResponse.success(res, result.rows[0], 'FAQ entry created', 201); } catch (e) { next(e); } });
router.delete('/faq/:id', authMiddleware, requireRole('FACULTY', 'ADMIN'), async (req, res, next) => { try { await getPostgresPool().query('DELETE FROM faq_entries WHERE id = $1::uuid', [req.params.id]); return ApiResponse.success(res, { id: req.params.id }, 'FAQ entry deleted'); } catch (e) { next(e); } });
router.get('/campus/locations', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.campusLocations()); } catch (e) { next(e); } });
router.get('/map', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.map()); } catch (e) { next(e); } });
router.use(authMiddleware);
router.get('/community', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.community()); } catch (e) { next(e); } });
router.post('/community', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.createThread({ userId: req.user.id, ...req.body }), 'Thread created', 201); } catch (e) { next(e); } });
router.post('/community/:id/upvote', async (req, res, next) => { try { const result = await getPostgresPool().query('UPDATE community_threads SET upvotes = COALESCE(upvotes, 0) + 1 WHERE id = $1::uuid RETURNING *', [req.params.id]); return ApiResponse.success(res, result.rows[0], 'Thread upvoted'); } catch (e) { next(e); } });
router.get('/faculty/queries', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.facultyQueries(req.user.id, req.user.role)); } catch (e) { next(e); } });
router.post('/faculty/queries/:id/answer', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.answerFacultyQuery(req.params.id, req.user.id, req.body.response)); } catch (e) { next(e); } });
router.post('/notifications/broadcast', async (req, res, next) => { try { return ApiResponse.success(res, await dynamicRepository.notifyAll(req.body), 'Notifications dispatched', 201); } catch (e) { next(e); } });
router.patch('/library/books/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    const map = {
      title: 'title',
      author: 'author',
      isbn: 'isbn',
      department: 'department',
      shelfLocation: 'shelf_location',
      totalCopies: 'total_copies',
      availableCopies: 'available_copies',
    };
    for (const [key, column] of Object.entries(map)) {
      if (req.body[key] !== undefined) {
        values.push(req.body[key]);
        fields.push(`${column} = $${values.length}`);
      }
    }
    if (!fields.length) return ApiResponse.success(res, null, 'No changes supplied');
    values.push(req.params.id);
    const result = await getPostgresPool().query(
      `UPDATE library_books SET ${fields.join(', ')} WHERE id = $${values.length}::uuid RETURNING *`,
      values
    );
    return ApiResponse.success(res, result.rows[0], 'Library book updated');
  } catch (e) {
    next(e);
  }
});
router.patch('/placements/companies/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    const map = {
      companyName: 'company_name',
      tier: 'tier',
      packageLpa: 'package_lpa',
      eligibleBranches: 'eligible_branches',
      selectionRounds: 'selection_rounds',
      roles: 'roles',
    };
    for (const [key, column] of Object.entries(map)) {
      if (req.body[key] !== undefined) {
        values.push(req.body[key]);
        fields.push(`${column} = $${values.length}`);
      }
    }
    if (!fields.length) return ApiResponse.success(res, null, 'No changes supplied');
    values.push(req.params.id);
    const result = await getPostgresPool().query(
      `UPDATE placement_companies SET ${fields.join(', ')} WHERE id = $${values.length}::uuid RETURNING *`,
      values
    );
    return ApiResponse.success(res, result.rows[0], 'Placement company updated');
  } catch (e) {
    next(e);
  }
});
router.patch('/campus/locations/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    const map = {
      name: 'name',
      blockName: 'block_name',
      floorNumber: 'floor_number',
      roomNumber: 'room_number',
      category: 'category',
      facilityType: 'facility_type',
      status: 'status',
      description: 'description',
    };
    for (const [key, column] of Object.entries(map)) {
      if (req.body[key] !== undefined) {
        values.push(req.body[key]);
        fields.push(`${column} = $${values.length}`);
      }
    }
    if (!fields.length) return ApiResponse.success(res, null, 'No changes supplied');
    values.push(req.params.id);
    const result = await getPostgresPool().query(
      `UPDATE campus_locations SET ${fields.join(', ')} WHERE id = $${values.length}::uuid RETURNING *`,
      values
    );
    return ApiResponse.success(res, result.rows[0], 'Campus location updated');
  } catch (e) {
    next(e);
  }
});
export default router;
