import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, Power, Loader2 } from 'lucide-react';
import * as eventService from '../../services/eventService';
import { formatDate } from '../../utils/helpers';
